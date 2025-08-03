import React, { useState, useEffect } from 'react';

const ProductForm = ({ product = null, onSubmit, onCancel, loading = false, categories = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    articleNumber: '',
    description: '',
    category: '',
    purchasePrice: '',
    sellingPrice: '',
    btwPercentage: 21,
    image: '',
    stock: '',
    minStock: ''
  });

  const [errors, setErrors] = useState({});
  const [priceInclBtw, setPriceInclBtw] = useState(0);

  // BTW percentages
  const btwOptions = [0, 9, 21];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        articleNumber: product.articleNumber || '',
        description: product.description || '',
        category: product.category || '',
        purchasePrice: product.purchasePrice || '',
        sellingPrice: product.sellingPrice || '',
        btwPercentage: product.btwPercentage || 21,
        image: product.image || '',
        stock: product.stock || '',
        minStock: product.minStock || ''
      });
    }
  }, [product]);

  // Bereken prijs inclusief BTW wanneer verkoopprijs of BTW percentage verandert
  useEffect(() => {
    const sellingPrice = parseFloat(formData.sellingPrice);
    const btwPercentage = parseFloat(formData.btwPercentage);
    
    if (sellingPrice && !isNaN(sellingPrice) && btwPercentage && !isNaN(btwPercentage)) {
      const priceIncl = sellingPrice * (1 + btwPercentage / 100);
      setPriceInclBtw(priceIncl);
    } else {
      setPriceInclBtw(0);
    }
  }, [formData.sellingPrice, formData.btwPercentage]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Productnaam is verplicht';
    }

    if (!formData.articleNumber.trim()) {
      newErrors.articleNumber = 'Artikelnummer is verplicht';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Categorie is verplicht';
    }

    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = 'Inkoopprijs moet groter zijn dan 0';
    }

    if (!formData.sellingPrice || parseFloat(formData.sellingPrice) <= 0) {
      newErrors.sellingPrice = 'Verkoopprijs moet groter zijn dan 0';
    }

    if (parseFloat(formData.sellingPrice) <= parseFloat(formData.purchasePrice)) {
      newErrors.sellingPrice = 'Verkoopprijs moet hoger zijn dan inkoopprijs';
    }

    if (formData.stock === '' || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Voorraad moet 0 of hoger zijn';
    }

    if (formData.minStock === '' || parseInt(formData.minStock) < 0) {
      newErrors.minStock = 'Minimum voorraad moet 0 of hoger zijn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        purchasePrice: parseFloat(formData.purchasePrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        btwPercentage: parseInt(formData.btwPercentage),
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock)
      };
      onSubmit(submitData);
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

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) {
      return '€0,00';
    }
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-navy mb-6">
        {product ? 'Product Bewerken' : 'Nieuw Product Toevoegen'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basis informatie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Productnaam *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Bijv. Smart Lock Pro"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Artikelnummer *
            </label>
            <input
              type="text"
              name="articleNumber"
              value={formData.articleNumber}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${
                errors.articleNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Bijv. SL-001"
            />
            {errors.articleNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.articleNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categorie *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecteer categorie</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
              <option value="Nieuwe categorie">+ Nieuwe categorie</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Afbeelding URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="https://voorbeeld.nl/afbeelding.jpg"
            />
          </div>
        </div>

        {/* Beschrijving */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beschrijving
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            placeholder="Beschrijf het product..."
          />
        </div>

        {/* Prijzen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inkoopprijs (excl. BTW) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">€</span>
              <input
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${
                  errors.purchasePrice ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.purchasePrice && (
              <p className="text-red-500 text-sm mt-1">{errors.purchasePrice}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verkoopprijs (excl. BTW) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">€</span>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${
                  errors.sellingPrice ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.sellingPrice && (
              <p className="text-red-500 text-sm mt-1">{errors.sellingPrice}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              BTW Percentage
            </label>
            <select
              name="btwPercentage"
              value={formData.btwPercentage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {btwOptions.map(percentage => (
                <option key={percentage} value={percentage}>
                  {percentage}%
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Prijs inclusief BTW (readonly) */}
        <div className="bg-gray-50 p-4 rounded-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verkoopprijs inclusief BTW
          </label>
          <div className="text-2xl font-bold text-gold">
            {priceInclBtw > 0 ? formatCurrency(priceInclBtw) : '€0,00'}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Automatisch berekend op basis van verkoopprijs en BTW percentage
          </p>
        </div>

        {/* Voorraad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Huidige voorraad *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.stock && (
              <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum voorraad *
            </label>
            <input
              type="number"
              name="minStock"
              value={formData.minStock}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${
                errors.minStock ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.minStock && (
              <p className="text-red-500 text-sm mt-1">{errors.minStock}</p>
            )}
          </div>

          <div className="flex items-end">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voorraad status
              </label>
              <div className={`px-3 py-2 rounded-md text-sm font-medium ${
                formData.stock && formData.minStock && parseInt(formData.stock) <= parseInt(formData.minStock)
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {formData.stock && formData.minStock && parseInt(formData.stock) <= parseInt(formData.minStock)
                  ? 'Lage voorraad'
                  : 'Voorraad OK'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Knoppen */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
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
            {loading ? 'Bezig...' : (product ? 'Bijwerken' : 'Toevoegen')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm; 