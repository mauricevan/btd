import LoginForm from "../components/LoginForm";
import { useAuth } from "../context/AuthContext";
import { login as apiLogin } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const LockIcon = () => (
  <svg className="w-8 h-8 text-domred mb-2" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <rect x="5" y="11" width="14" height="8" rx="2" stroke="currentColor"/>
    <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor"/>
    <circle cx="12" cy="15" r="1.5" fill="currentColor"/>
  </svg>
);

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogin = async (email, password, setError) => {
    const user = await apiLogin(email, password);
    if (user) {
      login(user); // Pass the full user object
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user/tasks");
      }
    } else {
      setError(t("invalid_login"));
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white font-sans">
      <motion.div
        className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-dom p-8 text-center relative animate-fade-in"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <LockIcon />
        <h1 className="text-2xl font-bold mb-6 text-domred">{t("login")}</h1>
        <LoginForm onLogin={handleLogin} />
        <div className="mt-6 text-sm text-gray-600">
          {t("no_account")} <Link to="/register" className="text-domred font-semibold hover:underline">{t("register_here")}</Link>
        </div>
      </motion.div>
    </div>
  );
} 