import { useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleTrack = async () => {
    if (!orderId.trim()) return;
    try {
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStatus(docSnap.data().status || 'Pending');
      } else {
        setStatus('Order not found');
      }
    } catch (e: any) {
      if (e?.code === 'permission-denied') {
        setStatus('Permission denied (Order not found or invalid access)');
      } else {
        setStatus('Error tracking order');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 pt-20 dark:text-gray-100 flex-grow w-full">
      <h1 className="text-2xl font-bold mb-6">Track Your Order</h1>
      <div className="flex gap-2 mb-6">
        <input type="text" placeholder="Enter Order ID" className="border p-2 flex-grow rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white" onChange={e => setOrderId(e.target.value)} />
        <button onClick={handleTrack} className="bg-gold text-white px-4 py-2 rounded">Track</button>
      </div>
      {status && <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded font-bold">Status: {status}</div>}
    </div>
  );
}
