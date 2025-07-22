export default function CallToAction({ text = "Shop Nu", onClick }) {
  console.log('CallToAction text:', text);
  return (
    <button
      onClick={onClick}
      style={{ background: '#E3000F', color: '#fff', border: '2px solid #000', fontSize: '1.25rem' }}
      className="px-8 py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 font-bold tracking-wide focus:outline-none focus:ring-4 focus:ring-gold/40 animate-cta"
    >
      {text}
    </button>
  );
} 