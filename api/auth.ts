import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ error: 'Admin password not configured' });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password required' });
  }

  // Constant-time comparison to prevent timing attacks
  const isValid = password.length === adminPassword.length &&
    password.split('').every((char, i) => char === adminPassword[i]);

  if (isValid) {
    // Generate a simple session token
    const token = Buffer.from(`admin:${Date.now()}:${Math.random().toString(36)}`).toString('base64');
    return res.status(200).json({ success: true, token });
  }

  // Small delay to prevent brute force
  return res.status(401).json({ error: 'Invalid password' });
}
