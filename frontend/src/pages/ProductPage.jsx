import { useParams, Link, useNavigate } from "react-router-dom";
import { PRODUCTS } from "../constants";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const LockIcon = () => (
  <svg className="w-8 h-8 text-domred mb-2" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <rect x="5" y="11" width="14" height="8" rx="2" stroke="currentColor"/>
    <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor"/>
    <circle cx="12" cy="15" r="1.5" fill="currentColor"/>
  </svg>
);

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.slug === slug);
  if (!product) return <div className="text-center py-20 text-domred font-bold">Product niet gevonden.</div>;
  const { t } = useLanguage();

  return (
    <div className="max-w-xl mx-auto px-4 py-12 font-sans">
      <motion.div
        className="bg-white rounded-2xl shadow-dom p-8 text-center animate-fade-in"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <LockIcon />
        <img src={product.image} alt={product.name} className="h-32 mx-auto mb-4 rounded-xl shadow bg-white" />
        <h1 className="text-2xl font-bold mb-2 text-domred">{product.name}</h1>
        <p className="text-gray-700 mb-6 text-base md:text-lg font-medium">{product.description}</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
          <button
            className="w-full md:w-auto px-6 py-2 bg-domred text-white rounded-lg font-bold shadow hover:bg-white hover:text-domred border border-domred transition-all"
            onClick={() => navigate(`/order/${product.slug}`)}
          >
            {t("order_now")}
          </button>
          <button
            className="w-full md:w-auto px-6 py-2 bg-white text-domred rounded-lg font-bold shadow hover:bg-domred hover:text-white border border-domred transition-all"
            onClick={() => navigate(`/demo/${product.slug}`)}
          >
            {t("book_demo")}
          </button>
        </div>
        <div className="mt-8">
          <Link to="/webshop" className="text-domred font-semibold hover:underline">{t("back_to_webshop")}</Link>
        </div>
      </motion.div>
    </div>
  );
} 