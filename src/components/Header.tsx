import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Phone, Facebook } from 'lucide-react';
import { CATEGORIES } from '../constants';

export default function Header({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-white border-b border-[#E9ECEF] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black text-gold tracking-tighter">Elaf <span className="text-text-dark">BD</span></Link>
        
        <form onSubmit={handleSearch} className="flex items-center bg-[#F8F9FA] rounded-full px-4 py-2 border border-[#E9ECEF]">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="bg-transparent outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit"><Search size={18} className="text-text-muted" /></button>
        </form>

        <div className="flex items-center gap-4">
          <a href="tel:01610254293" className="flex items-center gap-1 text-sm text-text-dark hover:text-gold">
            <Phone size={16} /> Call Now
          </a>
          <a href="https://www.facebook.com/profile.php?id=61580402938657" target="_blank" rel="noopener noreferrer">
            <Facebook size={24} className="text-blue-600" />
          </a>
        </div>
      </div>
      <nav className="max-w-7xl mx-auto px-4 pb-2 flex gap-4 text-sm font-medium text-text-dark uppercase tracking-wide">
        {CATEGORIES.map(cat => <Link key={cat} to={`/category/${cat.toLowerCase()}`} className="hover:text-gold">{cat}</Link>)}
      </nav>
    </header>
  );
}
