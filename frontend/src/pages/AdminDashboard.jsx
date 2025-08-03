import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy">Welkom bij het Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Selecteer een optie om te beginnen</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Statistieken */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-navy mb-4">Statistieken</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Openstaande taken</span>
              <span className="text-2xl font-bold text-domred">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Nieuwe klanten</span>
              <span className="text-2xl font-bold text-navy">5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Lage voorraad</span>
              <span className="text-2xl font-bold text-gold">3</span>
            </div>
          </div>
        </div>

        {/* Snelle acties */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-navy mb-4">Snelle acties</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/tasks"
              className="flex flex-col items-center p-4 bg-navy/5 rounded-lg hover:bg-navy/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-navy mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-sm font-medium text-navy">Nieuwe taak</span>
            </Link>
            <Link
              to="/workorder"
              className="flex flex-col items-center p-4 bg-domred/5 rounded-lg hover:bg-domred/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-domred mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium text-domred">Werkbon</span>
            </Link>
            <Link
              to="/admin/customers/new"
              className="flex flex-col items-center p-4 bg-gold/5 rounded-lg hover:bg-gold/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="text-sm font-medium text-gold">Nieuwe klant</span>
            </Link>
            <Link
              to="/admin/inventory"
              className="flex flex-col items-center p-4 bg-navy/5 rounded-lg hover:bg-navy/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-navy mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <span className="text-sm font-medium text-navy">Voorraad</span>
            </Link>
          </div>
        </div>

        {/* Recente activiteit */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-navy mb-4">Recente activiteit</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-gray-600">Nieuwe taak toegewezen aan Jan</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-gray-600">Klant bijgewerkt: Bedrijf X</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span className="text-gray-600">Voorraad waarschuwing: Product Y</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 