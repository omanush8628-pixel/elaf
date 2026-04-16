import { Phone, Facebook, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function StickyContactBar() {
  const contacts = [
    { icon: MessageCircle, href: "https://wa.me/8801610254293", color: "bg-green-500" },
    { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61580402938657", color: "bg-blue-600" },
    { icon: Phone, href: "tel:01610254293", color: "bg-gold" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {contacts.map((item, idx) => (
        <motion.a
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${item.color} text-white p-4 rounded-full shadow-lg`}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: idx * 0.2 }}
          whileHover={{ scale: 1.1 }}
        >
          <item.icon size={28} />
        </motion.a>
      ))}
    </div>
  );
}
