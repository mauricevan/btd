import { Link } from "react-router-dom";
import { NAV_LINKS } from "../constants";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { isLoggedIn, role, logout } = useAuth();
  const { cartCount } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  

  

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-dom flex items-center justify-between px-6 py-3 rounded-b-2xl border-b border-domred/10 font-sans relative">
      {/* Left: Logo and Title */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <img src="/logo.png" alt="BTD Dordrecht" className="h-10 w-10 rounded-full border-2 border-domred shadow bg-white" />
        <span className="font-extrabold text-xl tracking-wide text-domred">BTD Dordrecht</span>
      </div>
      {/* Center: Dashboard Button for logged in users */}
      <div className="flex-1 flex justify-center gap-4">
        {isLoggedIn && role === "admin" && (
          <Link to="/admin">
            <button className="px-5 py-2 bg-domred text-white rounded-lg font-bold shadow hover:bg-gold hover:text-navy border border-domred transition-all">
              Admin Dashboard
            </button>
          </Link>
        )}
        {isLoggedIn && role !== "admin" && (
          <Link to="/user/tasks">
            <button className="px-5 py-2 bg-navy text-white rounded-lg font-bold shadow hover:bg-gold hover:text-navy border border-navy transition-all">
              Mijn Werkplek
            </button>
          </Link>
        )}

      </div>
      {/* Right: Nav Links, Language, Cart, Auth */}
      <div className="flex gap-2 md:gap-4 items-center text-base font-medium flex-shrink-0">
        <button
          className="px-3 py-1 rounded-lg border border-domred text-domred font-semibold hover:bg-domred hover:text-white transition-all"
          onClick={toggleLanguage}
          aria-label="Wissel taal"
        >
          {language === "nl" ? "NL" : "EN"}
        </button>
        {NAV_LINKS.map(link => (
          <Link
            key={link.name}
            to={link.path}
            className="relative px-2 py-1 text-domred hover:text-black transition-colors duration-200 group font-semibold"
          >
            <span>{t(link.name.toLowerCase())}</span>
            <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-domred scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded"></span>
          </Link>
        ))}
        <NotificationBell />
        <Link to="/cart" className="relative group ml-2">
          <motion.div
            whileHover={{ scale: 1.15, rotate: -8 }}
            whileTap={{ scale: 0.95, rotate: 8 }}
            className="inline-block"
          >
            <svg className="w-7 h-7 text-domred group-hover:text-black transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1.5" />
              <circle cx="19" cy="21" r="1.5" />
              <path d="M2.5 3h2l2.5 13h11l2-8H6.5" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-domred text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
                {cartCount}
              </span>
            )}
          </motion.div>
        </Link>
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="ml-2 px-4 py-1.5 rounded-lg bg-domred text-white hover:bg-white hover:text-domred border border-domred font-semibold shadow transition-all">{t("login")}</Link>
            <Link to="/register" className="ml-2 px-4 py-1.5 rounded-lg border-2 border-domred text-domred hover:bg-domred hover:text-white font-semibold transition-all">{t("register")}</Link>
          </>
        ) : (
          <button onClick={logout} className="ml-4 px-4 py-1.5 rounded-lg bg-black text-white hover:bg-domred font-semibold shadow transition-all">{t("logout")}</button>
        )}
      </div>
    </nav>
  );
} 