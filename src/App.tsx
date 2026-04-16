import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { motion } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import TrackOrder from './components/TrackOrder';
import AdminPanel from './components/AdminPanel';
import StickyContactBar from './components/StickyContactBar';
import RippleEffect from './components/RippleEffect';
import Shop from './components/Shop';
import ProductDetail from './components/ProductDetail';
import { Product, CartItem } from './types';
import { db, auth } from './firebase';
import { collection, onSnapshot, addDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './utils/firebaseErrorHandler';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [localFallbackProducts, setLocalFallbackProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Load localStorage fallback
  useEffect(() => {
    try {
      const saved = localStorage.getItem('products');
      if (saved) {
        setLocalFallbackProducts(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load local products fallback", e);
    }
  }, []);

  // Auth & Connection Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
      } else {
        try {
          // Attempt to sign in anonymously if not signed in (for normal users)
          await signInAnonymously(auth);
        } catch (error: any) {
          console.error("Auth Error:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync Products from Firestore
  useEffect(() => {
    const collRef = collection(db, 'products');
    const unsubscribe = onSnapshot(collRef, (snapshot) => {
      const fetchedProducts: Product[] = [];
      snapshot.forEach(doc => {
        fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(fetchedProducts);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return () => unsubscribe();
  }, []);

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
    
    const orderData = { 
       ...data, 
       customerName: data.name, 
       cartItemsRaw: JSON.stringify(cart), 
       totalPrice: total, 
       timestamp: new Date().toISOString(), 
       status: 'Pending' 
    };
    
    let orderId = '';
    
    try {
      if(user) {
         const docRef = await addDoc(collection(db, 'orders'), orderData);
         orderId = docRef.id;
      } else {
         console.warn("User not authenticated to submit order.");
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    }
    
    try {
      await emailjs.send(
        'service_47o06sb',
        'template_vfse5sk',
        { 
           customer_name: orderData.customerName,
           customer_phone: orderData.phone,
           customer_address: orderData.address,
           product_list: orderItemsString,
           total_price: orderData.totalPrice,
           payment_method: orderData.paymentMethod,
        },
        'Z5asZuHhFt_w0g-mY'
      );
    } catch (error) {
      console.error('Failed to send email:', error);
    }
    
    setCart([]);
    return orderId;
  };

  const displayProducts = products.length > 0 ? products : localFallbackProducts;

  return (
    <BrowserRouter>
      <RippleEffect />
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
        <Routes>
          <Route path="/admin" element={<AdminPanel products={displayProducts} setProducts={setProducts} />} />
          <Route path="/track" element={<><Header theme={theme} toggleTheme={toggleTheme} /><TrackOrder /><Footer /></>} />
          <Route path="*" element={
            <>
              <Header theme={theme} toggleTheme={toggleTheme} />
              <button className="fixed top-4 right-20 bg-gold text-white px-4 py-2 rounded z-40 transition-transform hover:scale-105 shadow-md" onClick={() => setIsCartOpen(true)}>Cart ({cart.length})</button>
              
              <Routes>
                <Route path="/category/:categoryId" element={<Shop products={displayProducts} onAddToCart={addToCart} onOrder={() => setIsCheckoutOpen(true)} />} />
                <Route path="/product/:productId" element={<ProductDetail products={displayProducts} onAddToCart={addToCart} />} />
                <Route path="/" element={<Shop products={displayProducts} onAddToCart={addToCart} onOrder={() => setIsCheckoutOpen(true)} />} />
              </Routes>

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
