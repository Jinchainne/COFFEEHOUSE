

export interface TxProposal {
  id: string;
  type: 'send' | 'swap';
  // For send
  to?: string;
  amount?: string;
  token?: 'USDC' | 'EURC';
  // For swap
  tokenIn?: 'USDC' | 'EURC';
  tokenOut?: 'USDC' | 'EURC';
  amountIn?: string;
  estimatedOut?: string;
  rate?: number;
  // Common
  description: string;
  status: 'pending' | 'confirmed' | 'executing' | 'success' | 'failed';
  txHash?: string;
  error?: string;
}

// Parse user message to detect intent
export function parseIntent(message: string): { type: string; params: Record<string, string> } | null {
  const lower = message.toLowerCase().trim();

  // SEND patterns: "send 100 USDC to 0x..." or "send 100 to alice" or "transfer 50 USDC 0x..."
  const sendMatch = lower.match(/(?:send|transfer|pay)\s+(\d+(?:\.\d+)?)\s*(?:usdc|eurc)?\s*(?:to|at)\s+(0x[a-f0-9]{40})/i);
  if (sendMatch) {
    return { type: 'send', params: { amount: sendMatch[1], to: sendMatch[2] } };
  }

  // SEND to name: "send 100 USDC to alice"
  const sendNameMatch = lower.match(/(?:send|transfer|pay)\s+(\d+(?:\.\d+)?)\s*(?:usdc|eurc)?\s*(?:to|at)\s+(\w+)/i);
  if (sendNameMatch && !sendNameMatch[2].startsWith('0x')) {
    return { type: 'send', params: { amount: sendNameMatch[1], toName: sendNameMatch[2] } };
  }

  // SWAP patterns: "swap 100 USDC to EURC" or "convert 50 USDC to EURC" or "exchange 100 usdc for eurc"
  const swapMatch = lower.match(/(?:swap|convert|exchange)\s+(\d+(?:\.\d+)?)\s*(usdc|eurc)\s*(?:to|for|into)\s*(usdc|eurc)/i);
  if (swapMatch) {
    return { type: 'swap', params: { amount: swapMatch[1], tokenIn: swapMatch[2].toUpperCase(), tokenOut: swapMatch[3].toUpperCase() } };
  }

  // BALANCE patterns: "what's my balance" or "check balance" or "how much do I have"
  const balanceMatch = lower.match(/(?:balance|how much|check.*balance|what.*have)/i);
  if (balanceMatch) {
    return { type: 'balance', params: {} };
  }

  // HELP patterns
  const helpMatch = lower.match(/(?:help|what can you do|commands|features)/i);
  if (helpMatch) {
    return { type: 'help', params: {} };
  }

  return null;
}

// Resolve contact name to address
export function resolveContact(name: string, contacts: { name: string; address: string }[]): string | null {
  const found = contacts.find(c => c.name.toLowerCase().includes(name.toLowerCase()));
  return found?.address || null;
}

// USDC/EURC real-time rate (simplified - in production use oracle)
export function getSwapRate(tokenIn: string, tokenOut: string): number {
  // USDC ≈ EURC on Arc (both stablecoins, USDC=$1, EURC≈€1)
  // Real rate: 1 USDC = ~0.877 EURC (based on EUR/USD rate)
  if (tokenIn === 'USDC' && tokenOut === 'EURC') return 0.876691;
  if (tokenIn === 'EURC' && tokenOut === 'USDC') return 1.1407;
  return 1;
}
