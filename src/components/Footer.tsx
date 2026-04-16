export default function Footer() {
  return (
    <footer className="bg-text-dark text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4 text-gold">Elaf BD</h3>
          <p className="text-sm text-text-muted">Your trusted destination for premium fashion and lifestyle products.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 text-gold">Contact</h3>
          <p className="text-sm text-text-muted">WhatsApp: 01610-254293</p>
          <p className="text-sm text-text-muted">Email: elafbd810@gmail.com</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 text-gold">Policies</h3>
          <a href="#" className="block text-sm text-text-muted hover:text-white">Delivery Policy</a>
          <a href="#" className="block text-sm text-text-muted hover:text-white">Return Policy</a>
        </div>
      </div>
    </footer>
  );
}
