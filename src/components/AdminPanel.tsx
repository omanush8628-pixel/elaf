import { useState } from 'react';
import { Order, Product } from '../types';

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const products: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
  const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <input type="password" placeholder="Passcode" className="border p-2" onChange={e => setPassword(e.target.value)} />
        <button onClick={() => password === '1234' && setIsAuthenticated(true)} className="bg-gold text-white p-2">Login</button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
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
