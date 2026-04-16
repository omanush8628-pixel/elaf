export default function Footer() {
  return (
    <footer className="bg-text-dark text-white py-8 mt-12 transition-colors duration-300 dark:bg-gray-900 border-t border-gold">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4 text-gold">Elaf BD</h3>
          <p className="text-sm text-text-muted">Your trusted destination for premium fashion and lifestyle products.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 text-gold">Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm text-text-muted hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="text-sm text-text-muted hover:text-white transition-colors">Contact</a></li>
            <li><a href="#" className="text-sm text-text-muted hover:text-white transition-colors">SEO & Policies</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 text-gold">Contact Info</h3>
          <p className="text-sm text-text-muted">WhatsApp: 01610-254293</p>
          <p className="text-sm text-text-muted">Email: elafbd810@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}
