import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCustomers } from '../../context/CustomerContext';

const CustomerDetail = () => {
  const { id } = useParams();
  const { role } = useAuth();
  const navigate = useNavigate();
  const { selectedCustomer, loading, error, loadCustomer, addNote } = useCustomers();
  
  const [newNote, setNewNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Check admin access
  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  // Load customer data
  useEffect(() => {
    if (id) {
      loadCustomer(id);
    }
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const success = await addNote(id, newNote);
    if (success) {
      setNewNote('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeBadge = (type) => {
    const colors = {
      particulier: 'bg-blue-100 text-blue-800',
      bedrijf: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${colors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type === 'particulier' ? 'Particulier' : 'Bedrijf'}
      </span>
    );
  };

  if (role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Fout</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin/customers')}
            className="px-4 py-2 bg-gold text-white rounded-md hover:bg-gold/90"
          >
            Terug naar klanten
          </button>
        </div>
      </div>
    );
  }

  if (!selectedCustomer) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Klant niet gevonden</h2>
          <button
            onClick={() => navigate('/admin/customers')}
            className="px-4 py-2 bg-gold text-white rounded-md hover:bg-gold/90"
          >
            Terug naar klanten
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/admin/customers')}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Terug naar klanten
              </button>
              <h1 className="text-3xl font-bold text-navy">{selectedCustomer.name}</h1>
              <div className="flex items-center mt-2 space-x-4">
                {getTypeBadge(selectedCustomer.type)}
                <span className="text-gray-500">Klant sinds {formatDate(selectedCustomer.createdAt)}</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(`/admin/customers/${id}/edit`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Bewerken
              </button>
            </div>
          </div>
        </div>

        {/* Success message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Notitie succesvol toegevoegd</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-navy mb-4">Contactgegevens</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">E-mail</label>
                  <p className="text-gray-900">{selectedCustomer.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Telefoon</label>
                  <p className="text-gray-900">{selectedCustomer.phone}</p>
                </div>
                {selectedCustomer.address && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">Adres</label>
                    <p className="text-gray-900">{selectedCustomer.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-navy mb-4">Producten</h2>
              {selectedCustomer.products && selectedCustomer.products.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedCustomer.products.map((product, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gold/10 text-gold"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Geen producten toegewezen</p>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-navy mb-4">Notities</h2>
              {selectedCustomer.notes ? (
                <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-md">
                  {selectedCustomer.notes}
                </div>
              ) : (
                <p className="text-gray-500">Geen notities</p>
              )}

              {/* Add note form */}
              <form onSubmit={handleAddNote} className="mt-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Voeg een notitie toe..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button
                    type="submit"
                    disabled={!newNote.trim()}
                    className="px-4 py-2 bg-gold text-white rounded-md hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Toevoegen
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-navy mb-4">Overzicht</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Laatste contact</label>
                  <p className="text-gray-900">{formatDate(selectedCustomer.lastContact)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Aantal producten</label>
                  <p className="text-gray-900">{selectedCustomer.products?.length || 0}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Klant ID</label>
                  <p className="text-gray-900">#{selectedCustomer.id}</p>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-navy mb-4">Snelle acties</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/admin/customers/${id}/edit`)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Klant bewerken
                </button>
                <button
                  onClick={() => window.open(`mailto:${selectedCustomer.email}`, '_blank')}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  E-mail versturen
                </button>
                <button
                  onClick={() => window.open(`tel:${selectedCustomer.phone}`, '_blank')}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Bellen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail; 