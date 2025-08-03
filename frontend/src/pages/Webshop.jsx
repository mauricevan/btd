import { useState } from "react";
import { PRODUCTS } from "../constants";
import ProductCard from "../components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export default function Webshop() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [quickView, setQuickView] = useState(null);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const { t } = useLanguage();

  const FILTERS = [
    { label: t("all_products"), value: "all" },
    { label: t("for_business"), value: "business" },
    { label: t("for_consumers"), value: "consumer" },
  ];

  const getType = (product) => {
    if (product.name === "Tapkey" || product.name === "DOM System") return "business";
    if (product.name === "Tedee" || product.name === "DOM Cylinder") return "consumer";
    return "all";
  };

  // Minimalist lock icon
  const LockIcon = () => (
    <svg className="w-6 h-6 text-domred" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <rect x="5" y="11" width="14" height="8" rx="2" stroke="currentColor"/>
      <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor"/>
      <circle cx="12" cy="15" r="1.5" fill="currentColor"/>
    </svg>
  );

  const filtered = PRODUCTS.filter(p =>
    (filter === "all" || getType(p) === filter) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleQuickAdd = (product) => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-8 text-domred text-center tracking-tight"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        {t("webshop")}
      </motion.h1>
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder={t("search_product")}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-domred/30 rounded px-3 py-2 w-full sm:w-64 focus:ring-2 focus:ring-domred/30 font-medium"
        />
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-1.5 rounded-full font-semibold border transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-domred/30 ${filter === f.value ? "bg-domred text-white border-domred scale-105" : "bg-white text-domred border-domred hover:bg-domred/10"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filtered.map((product, i) => (
          <motion.div
            key={product.id}
            className="bg-white rounded-2xl shadow-dom p-6 flex flex-col items-center relative overflow-hidden group animate-fade-in"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 + i * 0.1 }}
          >
            <motion.img
              src={product.image}
              alt={product.name}
              className="h-28 w-28 object-contain mb-4 rounded-xl shadow group-hover:scale-110 transition-transform duration-300"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <div className="font-bold mb-1 text-domred text-lg text-center">{product.name}</div>
            <div className="text-gray-700 text-sm text-center mb-2">{product.description}</div>
            <div className="text-domred font-bold text-lg mb-2">€{product.price.toFixed(2)}</div>
            <div className="flex gap-2 mt-2">
              <LockIcon />
            </div>
            <button
              className={`mt-4 w-full px-5 py-2 bg-domred text-white rounded-lg hover:bg-white hover:text-domred border border-domred font-semibold shadow transition-all duration-200 ${added ? 'scale-105 bg-white text-domred border-2' : ''}`}
              onClick={() => { addToCart(product); setAdded(true); setTimeout(() => setAdded(false), 1200); }}
              aria-label={t("add_to_cart")}
            >
              {added ? t("added") : t("add_to_cart")}
            </button>
          </motion.div>
        ))}
      </div>
      {/* Quick View Modal */}
      <AnimatePresence>
        {quickView && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setQuickView(null); setAdded(false); }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
              initial={{ scale: 0.8, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-domred hover:text-gray-700 text-2xl font-bold focus:outline-none"
                onClick={() => { setQuickView(null); setAdded(false); }}
                aria-label="Sluiten"
              >
                &times;
              </button>
              <img src={quickView.image} alt={quickView.name} className="h-32 mx-auto mb-4 rounded-xl shadow" />
              <h2 className="text-2xl font-bold text-domred mb-2">{quickView.name}</h2>
              <div className="text-domred font-bold text-lg mb-2">€{quickView.price.toFixed(2)}</div>
              <p className="text-gray-700 mb-4 text-center">{quickView.description}</p>
              <button
                className={`w-full px-5 py-2 bg-domred text-white rounded-lg hover:bg-white hover:text-domred border border-domred font-semibold shadow transition-all duration-200 ${added ? 'scale-105 bg-white text-domred border-2' : ''}`}
                onClick={() => handleQuickAdd(quickView)}
                aria-label="Toevoegen aan winkelwagen"
              >
                {added ? 'Toegevoegd!' : 'In winkelwagen'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 