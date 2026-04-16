import { useState, useEffect } from 'react';
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
import StickyContactBar from './components/StickyContactBar';
import RippleEffect from './components/RippleEffect';
import { DUMMY_PRODUCTS } from './constants';
import { Product, CartItem } from './types';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : DUMMY_PRODUCTS;
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

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

  const handleOrderSubmit = async (data: any) => {
    const total = cart.reduce((acc, item) => acc + item.product.salePrice * item.quantity, 0);
    const orderItemsString = cart.map(i => `${i.product.name} (x${i.quantity})`).join(', ');
    const order = { ...data, customerName: data.name, cartItems: cart, totalPrice: total, id: Date.now().toString(), timestamp: new Date().toISOString(), status: 'Pending' };
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...orders, order]));
    
    try {
      await emailjs.send(
        'service_47o06sb',
        'template_vfse5sk',
        { 
           customer_name: order.customerName,
           customer_phone: order.phone,
           customer_address: order.address,
           product_list: orderItemsString,
           total_price: order.totalPrice,
           payment_method: order.paymentMethod,
        },
        'Z5asZuHhFt_w0g-mY'
      );
    } catch (error) {
      console.error('Failed to send email:', error);
    }
    
    setCart([]);
  };

  return (
    <BrowserRouter>
      <RippleEffect />
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
        <Routes>
          <Route path="/admin" element={<AdminPanel products={products} setProducts={setProducts} />} />
          <Route path="/track" element={<><Header theme={theme} toggleTheme={toggleTheme} /><TrackOrder /><Footer /></>} />
          <Route path="*" element={
            <>
              <Header theme={theme} toggleTheme={toggleTheme} />
              <button className="fixed top-4 right-20 bg-gold text-white px-4 py-2 rounded z-40" onClick={() => setIsCartOpen(true)}>Cart ({cart.length})</button>
              <main className="flex-grow max-w-7xl mx-auto px-4 py-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {products.map(p => <ProductCard key={p.id} product={p} onOrder={() => setIsCheckoutOpen(true)} onAddToCart={addToCart} />)}
                </motion.div>
              </main>
              <Footer />
              <StickyContactBar />
              <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cart} onUpdateQuantity={updateCartQuantity} />
              {isCheckoutOpen && <CheckoutModal onClose={() => setIsCheckoutOpen(false)} cartItems={cart} onSubmit={handleOrderSubmit} />}
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
