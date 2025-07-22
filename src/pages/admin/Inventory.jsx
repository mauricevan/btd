import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import ProductForm from '../../components/ProductForm';
import Papa from 'papaparse';

const Inventory = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const { 
    products, 
    categories,
    loading, 
    error, 
    searchProducts, 
    filterProductsByCategory, 
    getLowStockProducts,
    deleteProduct,
    addProduct,
    loadProducts 
  } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Check admin access
  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchProducts(searchQuery);
      } else if (selectedFilter === 'low-stock') {
        getLowStockProducts();
      } else if (selectedFilter !== 'all') {
        filterProductsByCategory(selectedFilter);
      } else {
        loadProducts();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedFilter]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (filter) => {
    setSelectedFilter(filter);
    setSearchQuery(''); // Clear search when filtering
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
      const success = await deleteProduct(productId);
      if (success) {
        setSuccessMessage('Product succesvol verwijderd');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    // This will be handled by the ProductForm component
    setShowForm(false);
    setEditingProduct(null);
    setSuccessMessage(editingProduct ? 'Product succesvol bijgewerkt' : 'Product succesvol toegevoegd');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // CSV Upload handlers
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          let added = 0;
          let failed = 0;
          let errors = [];

          for (const row of results.data) {
            try {
              // Validate required fields
              if (!row.name || !row.articleNumber || !row.sellingPrice || !row.category) {
                failed++;
                errors.push(`Rij ${results.data.indexOf(row) + 1}: Verplichte velden ontbreken`);
                continue;
              }

              // Parse numeric values
              const sellingPrice = parseFloat(row.sellingPrice);
              const purchasePrice = parseFloat(row.purchasePrice || row.sellingPrice * 0.6); // Default 40% margin
              const btwPercentage = parseInt(row.btwPercentage || 21);
              const stock = parseInt(row.stock || 0);
              const minStock = parseInt(row.minStock || 5);

              if (isNaN(sellingPrice) || sellingPrice <= 0) {
                failed++;
                errors.push(`Rij ${results.data.indexOf(row) + 1}: Ongeldige verkoopprijs`);
                continue;
              }

              const productData = {
                name: row.name.trim(),
                articleNumber: row.articleNumber.trim(),
                description: row.description || '',
                category: row.category.trim(),
                purchasePrice: purchasePrice,
                sellingPrice: sellingPrice,
                btwPercentage: btwPercentage,
                image: row.image || '',
                stock: stock,
                minStock: minStock
              };

              await addProduct(productData);
              added++;
            } catch (error) {
              failed++;
              errors.push(`Rij ${results.data.indexOf(row) + 1}: ${error.message}`);
            }
          }

          // Reload products
          await loadProducts();

          // Show results
          let message = `${added} producten succesvol toegevoegd`;
          if (failed > 0) {
            message += `, ${failed} overgeslagen`;
            console.error('CSV Upload errors:', errors);
          }

          setSuccessMessage(message);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 5000);

        } catch (error) {
          setError('Fout bij het verwerken van CSV bestand: ' + error.message);
        } finally {
          setUploading(false);
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      },
      error: (error) => {
        setError('Fout bij het lezen van CSV bestand: ' + error.message);
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('nl-NL');
  };

  if (role !== 'admin') {
    return null;
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
              onClick={handleFormCancel}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Terug naar voorraad
            </button>
          </div>
          <ProductForm
            product={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={loading}
            categories={categories}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-navy">Voorraadbeheer</h1>
              <p className="mt-2 text-gray-600">
                Beheer je producten, voorraad en prijzen
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={handleAddNew}
                className="inline-flex items-center px-4 py-2 bg-gold text-white rounded-md hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-gold"
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
                Nieuw Product
              </button>
            </div>
          </div>
        </div>

        {/* Success message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Totaal producten</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {products.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Lage voorraad</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {products.filter(p => p.isLowStock).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Totale waarde</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(products.reduce((sum, p) => sum + (p.sellingPrice * p.stock), 0))}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Categorieën</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {categories.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CSV Upload Help */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                CSV Upload Instructies
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p className="mb-2">
                  <strong>Verplichte kolommen:</strong> name, articleNumber, sellingPrice, category
                </p>
                <p className="mb-2">
                  <strong>Optionele kolommen:</strong> description, purchasePrice, btwPercentage, image, stock, minStock
                </p>
                <p className="text-xs mb-2">
                  <strong>Voorbeeld:</strong> name,articleNumber,description,category,sellingPrice,purchasePrice,btwPercentage,stock,minStock,image
                </p>
                <a
                  href="/voorbeeld-producten.csv"
                  download
                  className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download voorbeeld CSV bestand
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Zoek op naam, artikelnummer of beschrijving..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
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
              onChange={(e) => handleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="all">Alle producten</option>
              <option value="low-stock">Lage voorraad</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="sm:w-auto">
            <button
              onClick={handleUploadClick}
              disabled={uploading}
              className="inline-flex items-center px-4 py-2 bg-navy text-white rounded-md hover:bg-navy/90 focus:outline-none focus:ring-2 focus:ring-navy disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Uploaden...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  CSV Upload
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Products table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            </div>
          ) : products.length === 0 ? (
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Geen producten gevonden</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || selectedFilter !== 'all' 
                  ? 'Probeer je zoekopdracht aan te passen.' 
                  : 'Nog geen producten toegevoegd.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Artikelnummer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Voorraad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prijs (excl. BTW)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prijs (incl. BTW)
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acties
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className={`hover:bg-gray-50 ${product.isLowStock ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.image && (
                            <img
                              className="h-10 w-10 rounded-lg object-cover mr-3"
                              src={product.image}
                              alt={product.name}
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.description && product.description.length > 50
                                ? `${product.description.substring(0, 50)}...`
                                : product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.articleNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          product.isLowStock ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {product.stock}
                          {product.isLowStock && (
                            <span className="ml-1 text-xs text-red-500">(Laag)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(product.sellingPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gold">
                        {formatCurrency(product.priceInclBtw)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Bewerken
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Verwijderen
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory; 