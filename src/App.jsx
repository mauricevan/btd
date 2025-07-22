import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App; 