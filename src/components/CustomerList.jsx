import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerList = ({ 
  customers, 
  loading, 
  onSearch, 
  onFilter, 
  onDelete, 
  onAddNew,
  searchQuery = '',
  selectedFilter = 'all'
}) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleSearch = (e) => {
    onSearch(e.target.value);
  };

  const handleFilter = (e) => {
    onFilter(e.target.value);
  };

  const handleDelete = (customerId) => {
    setShowDeleteConfirm(customerId);
  };

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      await onDelete(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('nl-NL');
  };

  const getTypeBadge = (type) => {
    const colors = {
      particulier: 'bg-blue-100 text-blue-800',
      bedrijf: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type === 'particulier' ? 'Particulier' : 'Bedrijf'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Zoek en filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Zoek op naam, e-mail of telefoon..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={selectedFilter}
            onChange={handleFilter}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="all">Alle klanten</option>
            <option value="particulier">Particulieren</option>
            <option value="bedrijf">Bedrijven</option>
          </select>
        </div>
        <div className="sm:w-auto">
          <button
            onClick={onAddNew}
            className="w-full sm:w-auto inline-flex items-center px-4 py-2 bg-gold text-white rounded-md hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Nieuwe Klant
          </button>
        </div>
      </div>

      {/* Resultaten */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {customers.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Geen klanten gevonden</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || selectedFilter !== 'all' 
                ? 'Probeer je zoekopdracht aan te passen.' 
                : 'Nog geen klanten toegevoegd.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Klant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producten
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Laatste contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Laatste notitie
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => {
                  // Haal laatste notitie (laatste niet-lege regel)
                  let laatsteNotitie = '-';
                  if (customer.notes) {
                    const regels = customer.notes.split('\n').map(r => r.trim()).filter(Boolean);
                    if (regels.length > 0) {
                      laatsteNotitie = regels[regels.length - 1];
                    }
                  }
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Toegevoegd: {formatDate(customer.createdAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(customer.type)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {customer.products && customer.products.length > 0 ? (
                            customer.products.slice(0, 2).map((product, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gold/10 text-gold"
                              >
                                {product}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">Geen producten</span>
                          )}
                          {customer.products && customer.products.length > 2 && (
                            <span className="text-sm text-gray-500">
                              +{customer.products.length - 2} meer
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(customer.lastContact)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">
                        {laatsteNotitie}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/admin/customers/${customer.id}`)}
                            className="text-gold hover:text-gold/80"
                          >
                            Bekijken
                          </button>
                          <button
                            onClick={() => navigate(`/admin/customers/${customer.id}/edit`)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Bewerken
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Verwijderen
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Klant verwijderen
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Weet je zeker dat je deze klant wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuleren
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Verwijderen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList; 