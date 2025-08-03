import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function ProductCard({ product, onOrder }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (onOrder) return onOrder(product);
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-glass p-6 flex flex-col items-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group">
      <img src={product.image} alt={product.name} className="h-28 w-28 object-contain mb-4 rounded-xl shadow group-hover:scale-105 transition-transform duration-300" />
      <h3 className="font-bold text-lg mb-1 text-navy">{product.name}</h3>
      <p className="text-gray-600 mb-2 text-center">{product.description}</p>
      <div className="font-semibold text-gold mb-3 text-lg">€{product.price.toFixed(2)}</div>
      <button
        onClick={handleAdd}
        className={`px-5 py-2 bg-navy text-white rounded-lg hover:bg-gold hover:text-navy font-semibold shadow transition-all duration-200 relative ${added ? 'scale-105 bg-gold text-navy' : ''}`}
        aria-label="Toevoegen aan winkelwagen"
      >
        {added ? 'Toegevoegd!' : 'In winkelwagen'}
      </button>
    </div>
  );
} 