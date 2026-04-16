import { Product } from './types';

export const CATEGORIES = ['Punjabi', 'Burqa', 'Hijab', 'Shoes', 'Watches', 'Perfumes'];

export const DUMMY_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Punjabi', category: 'Punjabi', price: 2500, salePrice: 1999, imageUrl: 'https://picsum.photos/seed/punjabi/300/300', description: 'Hand-stitched premium cotton Punjabi with intricate embroidery.' },
  { id: '2', name: 'Elegant Burqa', category: 'Burqa', price: 3000, salePrice: 2499, imageUrl: 'https://picsum.photos/seed/burqa/300/300', description: 'Flowy, breathable fabric for ultimate comfort and modesty.' },
  { id: '3', name: 'Silk Hijab', category: 'Hijab', price: 800, salePrice: 599, imageUrl: 'https://picsum.photos/seed/hijab/300/300', description: 'Soft, luxurious silk hijab available in multiple vibrant colors.' },
  { id: '4', name: 'Leather Shoes', category: 'Shoes', price: 4000, salePrice: 3299, imageUrl: 'https://picsum.photos/seed/shoes/300/300', description: 'Genuine leather loafers with cushioned insole for all-day comfort.' },
  { id: '5', name: 'Classic Watch', category: 'Watches', price: 5000, salePrice: 3999, imageUrl: 'https://picsum.photos/seed/watch/300/300', description: 'Timeless luxury chronograph with a water-resistant finish.' },
  { id: '6', name: 'Floral Perfume', category: 'Perfumes', price: 1500, salePrice: 1199, imageUrl: 'https://picsum.photos/seed/perfume/300/300', description: 'Long-lasting floral fragrance with hints of musk.' },
];
