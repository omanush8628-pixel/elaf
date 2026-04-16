import React, { useState } from 'react';
import { Product } from '../types';
import { CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function CheckoutModal({ onClose, cartItems, onSubmit }: { onClose: () => void, cartItems: any[], onSubmit: (data: any) => Promise<void> }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', paymentMethod: 'COD', transactionId: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setIsProcessing(true);
      await onSubmit(formData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-gray-900 p-8 rounded-lg w-full max-w-md text-center shadow-2xl border border-[#E9ECEF] dark:border-gray-700">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold dark:text-white mb-2">ধন্যবাদ!</h2>
          <p className="text-text-muted dark:text-gray-300">আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 dark:text-gray-100 p-8 rounded-lg w-full max-w-lg transition-colors duration-300 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">Checkout - Step {step}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <input type="text" placeholder="Full Name" required className="w-full border dark:border-gray-700 bg-transparent p-2 rounded" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="tel" placeholder="Phone Number" required className="w-full border dark:border-gray-700 bg-transparent p-2 rounded" onChange={e => setFormData({...formData, phone: e.target.value})} />
              <textarea placeholder="Delivery Address" required className="w-full border dark:border-gray-700 bg-transparent p-2 rounded" onChange={e => setFormData({...formData, address: e.target.value})} />
            </>
          )}
          {step === 2 && (
            <>
              <select className="w-full border dark:border-gray-700 bg-transparent p-2 rounded" onChange={e => setFormData({...formData, paymentMethod: e.target.value as any})}>
                <option value="COD" className="dark:bg-gray-900">Cash on Delivery</option>
                <option value="bKash/Nagad/Rocket" className="dark:bg-gray-900">bKash/Nagad/Rocket</option>
              </select>
              {formData.paymentMethod !== 'COD' && (
                <div className="bg-gold-light dark:bg-gold-dark/20 p-4 rounded text-sm space-y-2">
                  <p>Merchant Number: 01610-254293</p>
                  <input type="text" placeholder="Transaction ID" className="w-full border dark:border-gray-700 bg-transparent p-2 rounded" onChange={e => setFormData({...formData, transactionId: e.target.value})} />
                </div>
              )}
            </>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button type="button" onClick={onClose} disabled={isProcessing} className="flex-1 bg-gray-200 dark:bg-gray-800 py-2 rounded font-medium disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isProcessing} className="flex-1 bg-gold text-white py-2 rounded font-bold disabled:opacity-50 flex justify-center items-center">
              {isProcessing ? 'Processing...' : step === 1 ? 'Next' : 'Confirm Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
