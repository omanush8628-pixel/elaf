import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onOrder: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard(props: ProductCardProps) {
  return (
    <div className="border border-[#E9ECEF] rounded-lg p-4 hover:border-gold transition-colors bg-white">
      <img src={props.product.imageUrl} alt={props.product.name} className="w-full h-48 object-cover rounded-md mb-4" referrerPolicy="no-referrer" />
      <h3 className="font-semibold text-lg">{props.product.name}</h3>
      <p className="text-sm text-text-muted my-2">{props.product.description}</p>
      <div className="flex items-center gap-2 my-2">
        <span className="text-text-muted line-through text-sm">৳{props.product.price}</span>
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
