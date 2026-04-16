import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function RippleEffect() {
  const [ripples, setRipples] = useState<{x: number, y: number, id: number}[]>([]);

  useEffect(() => {
    const handleMouseClick = (e: MouseEvent) => {
      const newRipple = { x: e.clientX, y: e.clientY, id: Date.now() };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== newRipple.id)), 1000);
    };
    window.addEventListener('click', handleMouseClick);
    return () => window.removeEventListener('click', handleMouseClick);
  }, []);

  return (
    <>
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed pointer-events-none rounded-full bg-gold/30"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
          }}
        />
      ))}
    </>
  );
}
