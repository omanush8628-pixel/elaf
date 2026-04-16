import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, Review } from '../types';
import { ArrowLeft, Star } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, addDoc, query, orderBy, Timestamp } from 'firebase/firestore';

interface ProductDetailProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function ProductDetail({ products, onAddToCart }: ProductDetailProps) {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.id === productId);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (!productId) return;
    const revColl = collection(db, 'products', productId, 'reviews');
    const q = query(revColl, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
    });
  }, [productId]);

  if (!product) return <div className="p-8 text-center">Product not found</div>;

  const handleAddReview = async () => {
    if (!auth.currentUser || !productId) return;
    await addDoc(collection(db, 'products', productId, 'reviews'), {
      productId,
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName || 'Anonymous',
      rating,
      comment,
      createdAt: Date.now(),
    });
    setComment('');
    setRating(5);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4 dark:text-white">
        <ArrowLeft size={20} /> Back
      </button>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={product.imageUrl} alt={product.name} className="w-full h-96 object-cover rounded-lg shadow-md" />
        </div>
        <div>
          <h1 className="text-3xl font-bold dark:text-white">{product.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 my-4" dangerouslySetInnerHTML={{ __html: product.description }} />
          <span className="text-gold-dark font-bold text-2xl">৳{product.salePrice}</span>
          <button onClick={() => onAddToCart(product)} className="w-full mt-6 bg-gold text-white py-3 rounded-md hover:bg-gold-dark font-bold">
            Add to Cart
          </button>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold dark:text-white mb-4">Reviews</h2>
        {auth.currentUser && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <h3 className="font-bold dark:text-white mb-2">Leave a Review</h3>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(r => (
                <Star key={r} onClick={() => setRating(r)} className={r <= rating ? 'text-yellow-400 fill-yellow-400 cursor-pointer' : 'text-gray-400 cursor-pointer'} />
              ))}
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} className="w-full p-2 rounded mb-2" placeholder="Write your review..."></textarea>
            <button onClick={handleAddReview} className="bg-gold text-white px-4 py-2 rounded">Submit</button>
          </div>
        )}
        
        {reviews.map(rev => (
          <div key={rev.id} className="border-b dark:border-gray-700 py-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold dark:text-white">{rev.userName}</span>
              <span className="text-sm dark:text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map(r => <Star key={r} className={r <= rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'} size={16} />)}
            </div>
            <p className="dark:text-gray-300">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
