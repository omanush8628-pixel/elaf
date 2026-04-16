import { X, Minus, Plus } from 'lucide-react';
import { CartItem } from '../types';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity }: { isOpen: boolean, onClose: () => void, cartItems: CartItem[], onUpdateQuantity: (productId: string, delta: number) => void }) {
  if (!isOpen) return null;
  const total = cartItems.reduce((acc, item) => acc + item.product.salePrice * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <div className="w-full max-w-sm bg-white p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <div className="space-y-4 mb-6">
          {cartItems.map(item => (
            <div key={item.product.id} className="flex justify-between items-center border-b pb-2">
              <span>{item.product.name}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => onUpdateQuantity(item.product.id, -1)}><Minus size={16} /></button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.product.id, 1)}><Plus size={16} /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="font-bold text-lg mb-6">Total: ৳{total}</div>
        <button className="w-full bg-gold text-white py-3 rounded uppercase font-bold">Checkout</button>
      </div>
    </div>
  );
}
