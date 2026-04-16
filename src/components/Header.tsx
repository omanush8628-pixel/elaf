import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Menu, X, Sun, Moon } from 'lucide-react';
import { CATEGORIES } from '../constants';

export default function Header({ theme, toggleTheme }: { theme: 'light' | 'dark', toggleTheme: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#E9ECEF] sticky top-0 z-50 dark:bg-gray-900 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="md:hidden dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="flex items-center gap-1 font-sans">
              <span className="text-text-dark dark:text-white">Elaf</span> 
              <span className="text-gold">BD</span>
            </div>
            <img src="https://i.postimg.cc/PJRkJy09/Screenshot-2026-04-01-193234-removebg-preview.png" alt="Logo" className="h-10 w-10 object-contain" referrerPolicy="no-referrer" />
            <div className="flex items-center gap-1 font-serif">
              <span className="text-text-dark dark:text-white">ইলাফ</span> 
              <span className="text-gold">বিডি</span>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <Link to="/admin" className="dark:text-white"><MoreVertical size={20} /></Link>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-b p-4 flex flex-col gap-2 text-sm font-medium text-text-dark uppercase tracking-wide dark:bg-gray-900 dark:text-white">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          {CATEGORIES.map(cat => <Link key={cat} to={`/category/${cat.toLowerCase()}`} onClick={() => setIsMenuOpen(false)}>{cat}</Link>)}
        </nav>
      )}
      <nav className="hidden md:flex max-w-7xl mx-auto px-4 pb-2 gap-4 text-sm font-medium text-text-dark uppercase tracking-wide dark:text-gray-300">
        <Link to="/" className="hover:text-gold">Home</Link>
        {CATEGORIES.map(cat => <Link key={cat} to={`/category/${cat.toLowerCase()}`} className="hover:text-gold">{cat}</Link>)}
      </nav>
    </header>
  );
}
