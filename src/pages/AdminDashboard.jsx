import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-navy">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Link to="/admin/inventory" className="bg-white rounded-2xl shadow-glass p-6 flex flex-col items-center hover:bg-gold/10 transition text-center">
          <span className="text-xl font-bold text-domred mb-2">Voorraad</span>
          <span className="text-sm text-gray-700">Beheer producten</span>
        </Link>
        <Link to="/admin/customers" className="bg-white rounded-2xl shadow-glass p-6 flex flex-col items-center hover:bg-gold/10 transition text-center">
          <span className="text-xl font-bold text-domred mb-2">Klanten</span>
          <span className="text-sm text-gray-700">CRM-systeem</span>
        </Link>
        <Link to="/admin/users" className="bg-white rounded-2xl shadow-glass p-6 flex flex-col items-center hover:bg-gold/10 transition text-center">
          <span className="text-xl font-bold text-domred mb-2">Gebruikers</span>
          <span className="text-sm text-gray-700">Beheer rollen</span>
        </Link>
        <Link to="/admin/tasks" className="bg-white rounded-2xl shadow-glass p-6 flex flex-col items-center hover:bg-gold/10 transition text-center">
          <span className="text-xl font-bold text-domred mb-2">Taken</span>
          <span className="text-sm text-gray-700">Wijs taken toe</span>
        </Link>
      </div>
    </div>
  );
} 