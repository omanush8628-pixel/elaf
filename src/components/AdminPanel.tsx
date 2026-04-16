import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Order, Product } from '../types';
import { db, auth, googleProvider } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../utils/firebaseErrorHandler';
import { Link } from 'react-router-dom';

export default function AdminPanel({ products, setProducts }: { products: Product[], setProducts: (products: Product[]) => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ name: '', category: '', price: 0, salePrice: 0, imageUrl: '', description: '' });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders: Order[] = [];
      snapshot.forEach(d => {
        const data = d.data();
        let cartItems = [];
        try {
          cartItems = data.cartItemsRaw ? JSON.parse(data.cartItemsRaw) : [];
        } catch(e) { }
        fetchedOrders.push({ id: d.id, ...data, cartItems } as Order);
      });
      setOrders(fetchedOrders);
    }, (error) => {
      // It will throw permission denied if not admin, but that's expected if a random user logs in
      console.warn("Order fetch err (might not be admin):", error);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch(err) {
      console.error(err);
      alert("Login attempt failed. Please make sure you open the website in a new tab if you are facing issues.");
    }
  };

  const handleLogout = () => signOut(auth);

  if (!user || user.isAnonymous) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 relative">
        <Link to="/" className="absolute top-4 left-4 border p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">&larr; Back to Home</Link>
        <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-lg flex flex-col gap-4 text-center max-w-sm">
          <h2 className="text-xl font-bold dark:text-white">Admin Access</h2>
          <p className="text-sm text-gray-500 mb-4">If clicking login redirects you out, please open this app in a <strong>New Tab</strong> first!</p>
          <button onClick={handleLogin} className="bg-gold text-white p-2 rounded font-bold hover:bg-gold-dark">
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProduct = async () => {
    try {
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), newProduct);
      } else {
        await addDoc(collection(db, 'products'), newProduct);
      }
      setNewProduct({ name: '', category: '', price: 0, salePrice: 0, imageUrl: '', description: '' });
      setEditingId(null);
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'products');
    }
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch(error) {
        handleFirestoreError(error, OperationType.DELETE, 'products');
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setNewProduct(product);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewProduct({ name: '', category: '', price: 0, salePrice: 0, imageUrl: '', description: '' });
  };
  
  const handleRestoreLocalData = async () => {
    const local = localStorage.getItem('products');
    if (!local) return alert('No previously saved local products found.');
    let parsed = [];
    try { parsed = JSON.parse(local); } catch(e){}
    if (!parsed.length) return alert('Local product list is empty.');
    
    if (!window.confirm(`Found ${parsed.length} previous products. Do you want to upload them to the connected database?`)) return;
    
    try {
      for (const p of parsed) {
         await setDoc(doc(db, 'products', p.id), p);
      }
      alert('Success! Restored products to your database.');
    } catch(e) {
      console.error(e);
      alert('Error uploading to database. Make sure your account has admin rights.');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto dark:text-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm border px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Home</Link>
          <span className="text-sm border px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">{user.email}</span>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-600">Logout</button>
        </div>
      </div>
      
      <div className="mb-4 text-right">
         <button onClick={handleRestoreLocalData} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 text-sm">
           Restore Previous Local Products
         </button>
      </div>
      
      <div className="mb-8 p-6 border rounded shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input type="text" placeholder="Name" value={newProduct.name} className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600" onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
          <input type="text" placeholder="Category" value={newProduct.category} className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600" onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
          <input type="number" placeholder="Regular Price" value={newProduct.price || ''} className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600" onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
          <input type="number" placeholder="Sale Price" value={newProduct.salePrice || ''} className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600" onChange={e => setNewProduct({...newProduct, salePrice: Number(e.target.value)})} />
          <input type="text" placeholder="Image URL" value={newProduct.imageUrl} className="border p-2 w-full rounded sm:col-span-2 dark:bg-gray-700 dark:border-gray-600" onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} />
        </div>
        <div className="mb-12">
          <ReactQuill theme="snow" value={newProduct.description} onChange={val => setNewProduct({...newProduct, description: val})} className="h-40 text-black bg-white" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button onClick={handleSaveProduct} className="bg-gold text-white px-6 py-2 rounded font-bold hover:bg-gold-dark">{editingId ? 'Update Product' : 'Add Product'}</button>
          {editingId && <button onClick={handleCancelEdit} className="bg-gray-300 text-gray-800 px-6 py-2 rounded font-bold hover:bg-gray-400">Cancel</button>}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Manage Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                <th className="border dark:border-gray-600 p-3">Name</th>
                <th className="border dark:border-gray-600 p-3">Price</th>
                <th className="border dark:border-gray-600 p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border dark:border-gray-600 p-3">
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded" />
                      {p.name}
                    </div>
                  </td>
                  <td className="border dark:border-gray-600 p-3">৳{p.salePrice}</td>
                <td className="border dark:border-gray-600 p-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700 font-bold px-3 py-1 border border-blue-500 rounded">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 font-bold px-3 py-1 border border-red-500 rounded">Delete</button>
                  </div>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="border dark:border-gray-600 p-3">Date</th>
              <th className="border dark:border-gray-600 p-3">Product(s)</th>
              <th className="border dark:border-gray-600 p-3">Customer</th>
              <th className="border dark:border-gray-600 p-3">Total</th>
              <th className="border dark:border-gray-600 p-3">Payment</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="border dark:border-gray-600 p-3">{new Date(order.timestamp).toLocaleDateString()}</td>
                <td className="border dark:border-gray-600 p-3">{order.cartItems.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}</td>
                <td className="border dark:border-gray-600 p-3">
                  <p className="font-semibold">{order.customerName}</p>
                  <p className="text-sm text-gray-500">{order.phone}</p>
                </td>
                <td className="border dark:border-gray-600 p-3">৳{order.totalPrice}</td>
                <td className="border dark:border-gray-600 p-3">{order.paymentMethod} {order.transactionId && <span className="block text-xs text-gray-500">Txn: {order.transactionId}</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
