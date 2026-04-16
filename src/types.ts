export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  salePrice: number;
  imageUrl: string;
  description: string;
}

export interface Order {
  id: string;
  productName: string;
  customerName: string;
  phone: string;
  address: string;
  timestamp: string;
  cartItems: CartItem[];
  totalPrice: number;
  paymentMethod: 'COD' | 'bKash/Nagad/Rocket';
  transactionId?: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
}

export interface CartItem {
  product: Product;
  quantity: number;
}
