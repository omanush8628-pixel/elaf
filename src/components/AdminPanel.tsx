import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Order, Product } from '../types';

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>(JSON.parse(localStorage.getItem('products') || '[]'));
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ name: '', category: '', price: 0, salePrice: 0, imageUrl: '', description: '' });
  const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <input type="password" placeholder="Passcode" className="border p-2" onChange={e => setPassword(e.target.value)} />
        <button onClick={() => password === '1234' && setIsAuthenticated(true)} className="bg-gold text-white p-2">Login</button>
      </div>
    );
  }

  const addProduct = () => {
    const updatedProducts = [...products, { ...newProduct, id: Date.now().toString() } as Product];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setNewProduct({ name: '', category: '', price: 0, salePrice: 0, imageUrl: '', description: '' });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Add Product</h2>
        <input type="text" placeholder="Name" className="border p-2 w-full mb-2" onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
        <input type="number" placeholder="Sale Price" className="border p-2 w-full mb-2" onChange={e => setNewProduct({...newProduct, salePrice: Number(e.target.value)})} />
        <input type="text" placeholder="Image URL" className="border p-2 w-full mb-2" onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} />
        <ReactQuill value={newProduct.description} onChange={val => setNewProduct({...newProduct, description: val})} className="mb-12 h-40" />
        <button onClick={addProduct} className="bg-gold text-white p-2 mt-4">Add Product</button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Orders</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Product(s)</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Payment</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td className="border p-2">{order.cartItems.map(i => i.product.name).join(', ')}</td>
              <td className="border p-2">{order.customerName}</td>
              <td className="border p-2">৳{order.totalPrice}</td>
              <td className="border p-2">{order.paymentMethod} {order.transactionId && `(${order.transactionId})`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
