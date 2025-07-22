import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const LockIcon = () => (
  <svg className="w-10 h-10 text-domred mb-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <rect x="5" y="11" width="14" height="8" rx="2" stroke="currentColor"/>
    <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor"/>
    <circle cx="12" cy="15" r="1.5" fill="currentColor"/>
  </svg>
);

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center font-sans">
      <motion.div
        className="bg-white rounded-2xl shadow-dom p-10 max-w-md w-full animate-fade-in"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <LockIcon />
        <h1 className="text-5xl font-bold mb-4 text-domred">404</h1>
        <p className="text-lg mb-6 text-gray-700">{t("page_not_found")}</p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="px-4 py-2 bg-domred text-white rounded hover:bg-white hover:text-domred border border-domred font-semibold transition-all">{t("back_home")}</Link>
          <Link to="/cart" className="px-4 py-2 bg-white text-domred rounded hover:bg-domred hover:text-white border border-domred font-semibold transition-all">{t("to_cart")}</Link>
        </div>
      </motion.div>
    </div>
  );
} 