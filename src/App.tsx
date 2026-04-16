import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import TrackOrder from './components/TrackOrder';
import AdminPanel from './components/AdminPanel';
import WhatsAppButton from './components/WhatsAppButton';
import RippleEffect from './components/RippleEffect';
import { DUMMY_PRODUCTS } from './constants';
import { Product, CartItem } from './types';

export default function App() {
  const [products] = useState<Product[]>(DUMMY_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      return existing ? prev.map(i => i.product.id === product.id ? {...i, quantity: i.quantity + 1} : i) : [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(i => i.product.id === productId ? {...i, quantity: Math.max(1, i.quantity + delta)} : i).filter(i => i.quantity > 0));
  };

  const handleOrderSubmit = (data: any) => {
    const total = cart.reduce((acc, item) => acc + item.product.salePrice * item.quantity, 0);
    const order = { ...data, cartItems: cart, totalPrice: total, id: Date.now().toString(), timestamp: new Date().toISOString(), status: 'Pending' };
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...orders, order]));
    
    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
      { cartItems: cart.map(i => i.product.name).join(', '), ...order },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
    ).then(() => alert('Order placed!'), () => alert('Email failed, order saved.'));
    
    setCart([]);
    setIsCheckoutOpen(false);
  };

  return (
    <BrowserRouter>
      <RippleEffect />
      <div className="min-h-screen flex flex-col bg-white">
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/track" element={<><Header onSearch={setSearchQuery} /><TrackOrder /><Footer /></>} />
          <Route path="*" element={
            <>
              <Header onSearch={setSearchQuery} />
              <button className="fixed top-4 right-20 bg-gold text-white px-4 py-2 rounded" onClick={() => setIsCartOpen(true)}>Cart ({cart.length})</button>
              <main className="flex-grow max-w-7xl mx-auto px-4 py-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => <ProductCard key={p.id} product={p} onOrder={() => setIsCheckoutOpen(true)} onAddToCart={addToCart} />)}
                </motion.div>
              </main>
              <Footer />
              <WhatsAppButton />
              <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cart} onUpdateQuantity={updateCartQuantity} />
              {isCheckoutOpen && <CheckoutModal onClose={() => setIsCheckoutOpen(false)} cartItems={cart} onSubmit={handleOrderSubmit} />}
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
