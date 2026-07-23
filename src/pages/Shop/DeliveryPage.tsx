import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop, type DeliveryAddress } from '../../hooks/useShop';
import { ArrowLeft, MapPin, Navigation, Truck } from 'lucide-react';

// Using Leaflet + OpenStreetMap (free, no API key needed)
const MAP_SCRIPT = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const MAP_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

// Default location: Ho Chi Minh City center
const DEFAULT_LAT = 10.8231;
const DEFAULT_LNG = 106.6297;

// Shipping fee calculation (flat rate + per km)
function calcShippingFee(lat: number, lng: number): number {
  // Shop location (HCMC District 1)
  const shopLat = 10.7769;
  const shopLng = 106.7009;
  // Haversine distance
  const R = 6371;
  const dLat = ((lat - shopLat) * Math.PI) / 180;
  const dLng = ((lng - shopLng) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((shopLat * Math.PI) / 180) * Math.cos((lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // Base fee $1.50 + $0.50/km, cap at $8
  return Math.min(8, Math.round((1.5 + km * 0.5) * 100) / 100);
}

export default function DeliveryPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, cartCount } = useShop();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [position, setPosition] = useState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [mapReady, setMapReady] = useState(false);

  const shippingFee = calcShippingFee(position.lat, position.lng);
  const grandTotal = cartTotal + shippingFee;

  // Reverse geocode using Nominatim (free)
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await resp.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch {
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  }, []);

  // Load Leaflet map
  useEffect(() => {
    if (mapReady) return;

    // Load CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = MAP_CSS;
      document.head.appendChild(link);
    }

    // Load JS
    if (!(window as any).L) {
      const script = document.createElement('script');
      script.src = MAP_SCRIPT;
      script.onload = () => setMapReady(true);
      document.head.appendChild(script);
    } else {
      setMapReady(true);
    }
  }, []);

  // Initialize map when ready
  useEffect(() => {
    if (!mapReady || !mapRef.current || mapInstanceRef.current) return;

    const L = (window as any).L;
    const map = L.map(mapRef.current).setView([DEFAULT_LAT, DEFAULT_LNG], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const marker = L.marker([DEFAULT_LAT, DEFAULT_LNG], { draggable: true }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setPosition({ lat: pos.lat, lng: pos.lng });
      reverseGeocode(pos.lat, pos.lng);
    });

    map.on('click', (e: any) => {
      marker.setLatLng(e.latlng);
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Initial geocode
    reverseGeocode(DEFAULT_LAT, DEFAULT_LNG);

    // Try browser geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          map.setView([lat, lng], 16);
          marker.setLatLng([lat, lng]);
          setPosition({ lat, lng });
          reverseGeocode(lat, lng);
        },
        () => {} // ignore errors
      );
    }
  }, [mapReady, reverseGeocode]);

  const handleConfirm = () => {
    const delivery: DeliveryAddress = {
      lat: position.lat,
      lng: position.lng,
      address,
      note,
    };
    // Save to sessionStorage for checkout
    sessionStorage.setItem('arcbank_delivery', JSON.stringify(delivery));
    sessionStorage.setItem('arcbank_shipping_fee', shippingFee.toString());
    navigate('/shop/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-lg mx-auto px-4 py-8 text-center">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">Cart is empty</p>
          <button onClick={() => navigate('/shop')} className="btn-primary">Browse Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <button onClick={() => navigate('/shop')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </button>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Delivery Address</h1>
        <p className="text-sm text-slate-400 mb-4">Tap on map or drag pin to set your location</p>

        {/* Map */}
        <div ref={mapRef} className="w-full h-72 rounded-2xl border border-slate-200 mb-4 z-0" />

        {/* Current location button */}
        <button
          onClick={() => {
            if (navigator.geolocation && mapInstanceRef.current && markerRef.current) {
              navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude: lat, longitude: lng } = pos.coords;
                mapInstanceRef.current.setView([lat, lng], 16);
                markerRef.current.setLatLng([lat, lng]);
                setPosition({ lat, lng });
                reverseGeocode(lat, lng);
              });
            }
          }}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          <Navigation className="w-4 h-4" /> Use my current location
        </button>

        {/* Address */}
        <div className="space-y-3 mb-6">
          <div className="card p-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 mb-1">Delivery Address</p>
                <p className="text-sm text-slate-900">{address || 'Select on map...'}</p>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">{position.lat.toFixed(6)}, {position.lng.toFixed(6)}</p>
              </div>
            </div>
          </div>

          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Delivery note (e.g., floor, building, phone...)"
            className="w-full"
          />
        </div>

        {/* Order Summary */}
        <div className="card p-4 mb-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Items ({cartCount})</span>
              <span className="font-semibold">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Shipping Fee</span>
              <span className="font-semibold text-blue-600">${shippingFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-100 pt-2 flex justify-between">
              <span className="text-sm font-bold">Grand Total</span>
              <span className="text-lg font-extrabold text-blue-600">${grandTotal.toFixed(2)} USDC</span>
            </div>
          </div>
        </div>

        <button onClick={handleConfirm} disabled={!address} className="btn-primary w-full">
          <Truck className="w-4 h-4" /> Confirm Address & Proceed to Payment
        </button>
      </div>
    </div>
  );
}
