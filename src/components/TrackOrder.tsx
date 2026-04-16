import { useState } from 'react';
import { Order } from '../types';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleTrack = () => {
    const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    setStatus(order ? order.status : 'Order not found');
  };

  return (
    <div className="max-w-md mx-auto p-8 pt-20">
      <h1 className="text-2xl font-bold mb-6">Track Your Order</h1>
      <div className="flex gap-2">
        <input type="text" placeholder="Enter Order ID" className="border p-2 flex-grow rounded" onChange={e => setOrderId(e.target.value)} />
        <button onClick={handleTrack} className="bg-gold text-white px-4 py-2 rounded">Track</button>
      </div>
      {status && <div className="mt-6 p-4 bg-gold-light rounded font-bold">Status: {status}</div>}
    </div>
  );
}
