import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Order, Product } from '../types';

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>(JSON.parse(localStorage.getItem('products') || '[]'));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ name: '', category: '', price: 0, salePrice: 0, imageUrl: '', description: '' });
  const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-lg flex flex-col gap-4">
          <input type="password" placeholder="Passcode" className="border p-2 rounded dark:bg-gray-700 dark:text-white" onChange={e => setPassword(e.target.value)} />
          <button onClick={() => password === '1234' && setIsAuthenticated(true)} className="bg-gold text-white p-2 rounded font-bold hover:bg-gold-dark">Login</button>
        </div>
      </div>
    );
  }

  const handleSaveProduct = () => {
    let updatedProducts;
    if (editingId) {
      updatedProducts = products.map(p => p.id === editingId ? { ...p, ...newProduct } as Product : p);
    } else {
      updatedProducts = [...products, { ...newProduct, id: Date.now().toString() } as Product];
    }
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setNewProduct({ name: '', category: '', price: 0, salePrice: 0, imageUrl: '', description: '' });
    setEditingId(null);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setNewProduct(product);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewProduct({ name: '', category: '', price: 0, salePrice: 0, imageUrl: '', description: '' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-gold">Admin Dashboard</h1>
      
      <div className="mb-8 p-6 border rounded shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input type="text" placeholder="Name" value={newProduct.name} className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600" onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
          <input type="text" placeholder="Category" value={newProduct.category} className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600" onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
          <input type="number" placeholder="Regular Price" value={newProduct.price || ''} className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600" onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
          <input type="number" placeholder="Sale Price" value={newProduct.salePrice || ''} className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600" onChange={e => setNewProduct({...newProduct, salePrice: Number(e.target.value)})} />
          <input type="text" placeholder="Image URL" value={newProduct.imageUrl} className="border p-2 w-full rounded col-span-2 dark:bg-gray-700 dark:border-gray-600" onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} />
        </div>
        <div className="mb-12">
          <ReactQuill theme="snow" value={newProduct.description} onChange={val => setNewProduct({...newProduct, description: val})} className="h-40 text-black bg-white" />
        </div>
        <div className="flex gap-4 mt-6">
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
                    <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700 font-bold px-3 py-1 border border-blue-500 rounded">Edit</button>
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
