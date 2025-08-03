import React, { useState, useEffect } from 'react';

const CustomerForm = ({ customer = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'particulier',
    address: '',
    notes: '',
    products: []
  });

  const [errors, setErrors] = useState({});

  // Product opties
  const productOptions = [
    'Smart Lock',
    'CCTV Camera',
    'Alarmsysteem',
    'Toegangscontrole',
    'Intercom',
    'Beveiligingsdeur',
    'Sleutelkluis',
    'Biometrische scanner'
  ];

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        type: customer.type || 'particulier',
        address: customer.address || '',
        notes: customer.notes || '',
        products: customer.products || []
      });
    }
  }, [customer]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Naam is verplicht';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail is verplicht';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail is ongeldig';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefoonnummer is verplicht';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleProductChange = (product) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(product)
        ? prev.products.filter(p => p !== product)
        : [...prev.products, product]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-navy mb-6">
        {customer ? 'Klant Bewerken' : 'Nieuwe Klant Toevoegen'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basis informatie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Naam *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Volledige naam"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="email@voorbeeld.nl"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefoon *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="06-12345678"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Klanttype
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="particulier">Particulier</option>
              <option value="bedrijf">Bedrijf</option>
            </select>
          </div>
        </div>

        {/* Adres */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adres
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            placeholder="Straat, huisnummer, postcode en plaats"
          />
        </div>

        {/* Producten */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Producten
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {productOptions.map(product => (
              <label key={product} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.products.includes(product)}
                  onChange={() => handleProductChange(product)}
                  className="rounded border-gray-300 text-gold focus:ring-gold"
                />
                <span className="text-sm text-gray-700">{product}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notities
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            placeholder="Extra informatie over de klant..."
          />
        </div>

        {/* Knoppen */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={loading}
          >
            Annuleren
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gold text-white rounded-md hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
          >
            {loading ? 'Bezig...' : (customer ? 'Bijwerken' : 'Toevoegen')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm; 