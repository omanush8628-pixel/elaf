import React, { useState } from 'react';
import { Product } from '../types';

export default function OrderPopup({ product, onClose, onSubmit }: { product: Product, onClose: () => void, onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Order: {product.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" required className="w-full border border-[#E9ECEF] p-2 rounded" onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="tel" placeholder="Phone Number" required className="w-full border border-[#E9ECEF] p-2 rounded" onChange={e => setFormData({...formData, phone: e.target.value})} />
          <textarea placeholder="Delivery Address" required className="w-full border border-[#E9ECEF] p-2 rounded" onChange={e => setFormData({...formData, address: e.target.value})} />
          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 bg-[#E9ECEF] py-2 rounded">Cancel</button>
            <button type="submit" className="flex-1 bg-gold text-white py-2 rounded">Submit Order</button>
          </div>
        </form>
      </div>
    </div>
  );
}
