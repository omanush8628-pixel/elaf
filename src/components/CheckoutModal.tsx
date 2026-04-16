import React, { useState } from 'react';
import { Product } from '../types';

export default function CheckoutModal({ onClose, cartItems, onSubmit }: { onClose: () => void, cartItems: any[], onSubmit: (data: any) => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', paymentMethod: 'COD', transactionId: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-8 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Checkout - Step {step}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <input type="text" placeholder="Full Name" required className="w-full border p-2 rounded" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="tel" placeholder="Phone Number" required className="w-full border p-2 rounded" onChange={e => setFormData({...formData, phone: e.target.value})} />
              <textarea placeholder="Delivery Address" required className="w-full border p-2 rounded" onChange={e => setFormData({...formData, address: e.target.value})} />
            </>
          )}
          {step === 2 && (
            <>
              <select className="w-full border p-2 rounded" onChange={e => setFormData({...formData, paymentMethod: e.target.value as any})}>
                <option value="COD">Cash on Delivery</option>
                <option value="bKash/Nagad/Rocket">bKash/Nagad/Rocket</option>
              </select>
              {formData.paymentMethod !== 'COD' && (
                <div className="bg-gold-light p-4 rounded text-sm space-y-2">
                  <p>Merchant Number: 01610-254293</p>
                  <input type="text" placeholder="Transaction ID" className="w-full border p-2 rounded" onChange={e => setFormData({...formData, transactionId: e.target.value})} />
                </div>
              )}
            </>
          )}
          <div className="flex gap-4 mt-6">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 py-2 rounded">Cancel</button>
            <button type="submit" className="flex-1 bg-gold text-white py-2 rounded">{step === 1 ? 'Next' : 'Confirm Order'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
