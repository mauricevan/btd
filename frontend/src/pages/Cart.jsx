import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const LockIcon = () => (
  <svg className="w-7 h-7 text-domred mb-2" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <rect x="5" y="11" width="14" height="8" rx="2" stroke="currentColor"/>
    <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor"/>
    <circle cx="12" cy="15" r="1.5" fill="currentColor"/>
  </svg>
);

export default function Cart() {
  const { cart, updateQty, removeFromCart, clearCart, cartTotal } = useCart();
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 font-sans">
      <motion.h1
        className="text-3xl font-bold mb-8 text-domred text-center tracking-tight"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        {t("cart")}
      </motion.h1>
      {cart.length === 0 ? (
        <motion.div
          className="bg-white rounded-2xl shadow-dom p-8 text-center animate-fade-in"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <LockIcon />
          <p className="mb-4 text-gray-700">{t("cart_empty")}</p>
          <Link to="/webshop" className="px-5 py-2 bg-domred text-white rounded-lg hover:bg-white hover:text-domred border border-domred font-semibold shadow transition-all">{t("continue_shopping")}</Link>
        </motion.div>
      ) : (
        <motion.div
          className="bg-white rounded-2xl shadow-dom p-6 animate-fade-in"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <table className="w-full mb-6 text-sm">
            <thead>
              <tr className="bg-domred text-white">
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-center">{t("quantity")}</th>
                <th className="p-2 text-right">{t("price")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(({ product, qty }) => (
                <tr key={product.id} className="border-b last:border-b-0">
                  <td className="p-2 flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="h-10 w-10 rounded shadow" />
                    <span className="font-medium text-domred">{product.name}</span>
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={e => updateQty(product.id, Number(e.target.value))}
                      className="w-16 border border-domred/30 rounded px-2 py-1 text-center focus:ring-2 focus:ring-domred/30"
                      aria-label={t("quantity")}
                    />
                  </td>
                  <td className="p-2 text-right text-domred font-bold">€{(product.price * qty).toFixed(2)}</td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-domred hover:text-black font-bold text-lg px-2"
                      aria-label={t("remove")}
                    >
                      &times;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={clearCart}
              className="px-4 py-1.5 bg-gray-200 text-domred rounded hover:bg-domred/10 hover:text-black font-semibold transition-all"
            >
              {t("clear_cart")}
            </button>
            <div className="text-xl font-bold text-domred">Totaal: <span className="text-black">€{cartTotal.toFixed(2)}</span></div>
          </div>
          <button className="w-full px-5 py-2 bg-domred text-white rounded-lg font-bold shadow hover:bg-white hover:text-domred border border-domred transition-all">Afrekenen</button>
        </motion.div>
      )}
    </div>
  );
} 