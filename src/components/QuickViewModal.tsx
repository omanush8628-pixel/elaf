import React from 'react';
import { Product } from '../types';
import { X } from 'lucide-react';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function QuickViewModal({ product, onClose, onAddToCart }: QuickViewModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <X className="dark:text-white" size={24} />
        </button>
        <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover rounded-md mb-4" />
        <h2 className="text-2xl font-bold dark:text-gray-100">{product.name}</h2>
        <p className="text-gray-600 dark:text-gray-400 my-2" dangerouslySetInnerHTML={{ __html: product.description }} />
        <div className="flex items-center justify-between mt-4">
          <span className="text-gold-dark font-bold text-xl">৳{product.salePrice}</span>
          <button onClick={() => { onAddToCart(product); onClose(); }} className="bg-gold text-white px-6 py-2 rounded-md hover:bg-gold-dark">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
