import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import QuickViewModal from './QuickViewModal';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onOrder: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard(props: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <div 
      className="border border-[#E9ECEF] dark:border-gray-700 rounded-lg p-4 hover:border-gold transition-all duration-300 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${props.product.id}`}>
        <img src={props.product.imageUrl} alt={props.product.name} className="w-full h-48 object-cover rounded-md mb-4" referrerPolicy="no-referrer" />
        <h3 className="font-semibold text-lg dark:text-gray-100">{props.product.name}</h3>
      </Link>
      
      {isHovered && (
        <button 
          onClick={() => setIsQuickViewOpen(true)}
          className="absolute top-4 right-4 bg-white/80 dark:bg-black/50 backdrop-blur-sm text-xs font-bold py-1 px-2 rounded"
        >
          Quick View
        </button>
      )}

      {isQuickViewOpen && <QuickViewModal product={props.product} onClose={() => setIsQuickViewOpen(false)} onAddToCart={props.onAddToCart} />}

      <div className="text-sm text-text-muted dark:text-gray-400 my-2" dangerouslySetInnerHTML={{ __html: props.product.description }} />
      <div className="flex items-center gap-2 my-2">
        <span className="text-text-muted dark:text-gray-400 line-through text-sm">৳{props.product.price}</span>
        <span className="text-gold-dark font-bold text-lg">৳{props.product.salePrice}</span>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => props.onAddToCart(props.product)}
          className="flex-1 bg-gray-200 py-2 rounded-md hover:bg-gray-300 transition-colors uppercase font-bold text-xs"
        >
          Add to Cart
        </button>
        <button 
          onClick={() => props.onOrder(props.product)}
          className="flex-1 bg-gold text-white py-2 rounded-md hover:bg-gold-dark transition-colors uppercase font-bold text-xs"
        >
          Order Now
        </button>
      </div>
    </div>
  );
}
