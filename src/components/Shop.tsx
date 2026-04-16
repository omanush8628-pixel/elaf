import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import ProductCard from './ProductCard';
import { Product } from '../types';
import { CATEGORIES } from '../constants';

interface ShopProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onOrder: () => void;
}

export default function Shop({ products, onAddToCart, onOrder }: ShopProps) {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  
  const currentCategory = categoryId 
    ? CATEGORIES.find(c => c.toLowerCase() === categoryId.toLowerCase()) || 'All'
    : 'All';

  const [selectedCategory, setSelectedCategory] = useState<string>(currentCategory);

  useEffect(() => {
    setSelectedCategory(currentCategory);
  }, [currentCategory]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCat = e.target.value;
    setSelectedCategory(newCat);
    if (newCat === 'All') {
      navigate('/');
    } else {
      navigate(`/category/${newCat.toLowerCase()}`);
    }
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold dark:text-white">
          {selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Collection`}
        </h2>
        
        <div className="flex items-center gap-2">
          <label htmlFor="category-filter" className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Filter by:
          </label>
          <select 
            id="category-filter"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border border-[#E9ECEF] dark:border-gray-700 bg-white dark:bg-gray-800 text-text-dark dark:text-white p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          {filteredProducts.map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onOrder={onOrder} 
              onAddToCart={onAddToCart} 
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No products found in this category.</p>
        </div>
      )}
    </main>
  );
}
