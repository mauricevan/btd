import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes";
import AdminSidebar from "./components/AdminSidebar";
import { useAuth } from "./context/AuthContext";
import { useLocation } from "react-router-dom";

function App() {
  const { role } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin") || location.pathname === "/workorder";
  const showAdminSidebar = role === "admin" && isAdminRoute;

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <div className="flex flex-1">
        {showAdminSidebar && <AdminSidebar />}
        <main className={`flex-1 ${showAdminSidebar ? "ml-64" : ""}`}>
        <AppRoutes />
      </main>
      </div>
      <Footer />
    </div>
  );
}

export default App; 