import { useParams, Link } from "react-router-dom";
import { PRODUCTS } from "../constants";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function OrderPage() {
  const { slug } = useParams();
  const product = PRODUCTS.find(p => p.slug === slug);
  const { t } = useLanguage();
  if (!product) return <div className="text-center py-20 text-domred font-bold">{t("product_not_found")}</div>;

  return (
    <div className="max-w-xl mx-auto px-4 py-12 font-sans">
      <motion.div
        className="bg-white rounded-2xl shadow-dom p-8 text-center animate-fade-in"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <img src={product.image} alt={product.name} className="h-32 mx-auto mb-4 rounded-xl shadow bg-white" />
        <h1 className="text-2xl font-bold mb-2 text-domred">{t("order_for", { name: product.name })}</h1>
        <p className="text-gray-700 mb-6 text-base md:text-lg font-medium">{t("order_sample", { name: product.name })}</p>
        <Link to={`/product/${product.slug}`} className="text-domred font-semibold hover:underline">{t("back_to_product")}</Link>
      </motion.div>
    </div>
  );
} 