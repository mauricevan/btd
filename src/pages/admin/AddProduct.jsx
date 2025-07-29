import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../services/products";
import Papa from 'papaparse';

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [product, setProduct] = useState({
    name: "",
    articleNumber: "",
    description: "",
    categoryId: 1,
    purchasePrice: "",
    sellingPrice: "",
    btwPercentage: 21,
    stock: 0,
    minStock: 5,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      await productService.createProduct({
        ...product,
        categoryId: parseInt(product.categoryId),
        purchasePrice: parseFloat(product.purchasePrice),
        sellingPrice: parseFloat(product.sellingPrice),
        btwPercentage: parseInt(product.btwPercentage),
        stock: parseInt(product.stock),
        minStock: parseInt(product.minStock),
      });

      navigate("/admin/inventory", { 
        state: { message: "Product succesvol toegevoegd" }
      });
    } catch (err) {
      console.error("Error adding product:", err);
      if (err.response?.data?.details) {
        setFieldErrors(err.response.data.details);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          if (results.errors.length > 0) {
            throw new Error("CSV bestand bevat fouten");
          }

          const products = results.data.map(row => ({
            ...row,
            purchasePrice: parseFloat(row.purchasePrice),
            sellingPrice: parseFloat(row.sellingPrice),
            btwPercentage: parseInt(row.btwPercentage),
            stock: parseInt(row.stock),
            minStock: parseInt(row.minStock),
            categoryId: parseInt(row.categoryId),
          }));

          await productService.bulkUpload(products);
          navigate("/admin/inventory", { 
            state: { message: `${products.length} producten succesvol toegevoegd` }
          });
        } catch (err) {
          console.error("Error uploading CSV:", err);
          setError("Er ging iets mis bij het uploaden van het CSV bestand");
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        console.error("CSV parse error:", error);
        setError("Er ging iets mis bij het lezen van het CSV bestand");
        setLoading(false);
      }
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-navy">Product toevoegen</h1>
          <button
            onClick={() => navigate("/admin/inventory")}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Terug naar voorraad
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Sluiten</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-navy mb-4">CSV Upload</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-blue-800 mb-2">CSV Upload Instructies</h3>
            <p className="text-sm text-blue-700 mb-2">
              Upload een CSV bestand met de volgende kolommen:
            </p>
            <ul className="list-disc list-inside text-sm text-blue-700 mb-4">
              <li>name - Naam van het product</li>
              <li>articleNumber - Uniek artikelnummer</li>
              <li>description - Productbeschrijving</li>
              <li>categoryId - ID van de categorie (1-4)</li>
              <li>purchasePrice - Inkoopprijs (decimaal)</li>
              <li>sellingPrice - Verkoopprijs (decimaal)</li>
              <li>btwPercentage - BTW percentage (0, 9, of 21)</li>
              <li>stock - Huidige voorraad (geheel getal)</li>
              <li>minStock - Minimale voorraad (geheel getal)</li>
            </ul>
            <div className="flex items-center gap-4">
              <a
                href="/voorbeeld-producten.csv"
                download
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download voorbeeld CSV
              </a>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  {loading ? "Uploaden..." : "Upload CSV"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-navy mb-4">Product handmatig toevoegen</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Naam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:border-navy ${
                    fieldErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artikelnummer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="articleNumber"
                  value={product.articleNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:border-navy ${
                    fieldErrors.articleNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {fieldErrors.articleNumber && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.articleNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inkoopprijs (€) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="purchasePrice"
                  value={product.purchasePrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:border-navy ${
                    fieldErrors.purchasePrice ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {fieldErrors.purchasePrice && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.purchasePrice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verkoopprijs (€) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={product.sellingPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:border-navy ${
                    fieldErrors.sellingPrice ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {fieldErrors.sellingPrice && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.sellingPrice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BTW percentage
                </label>
                <select
                  name="btwPercentage"
                  value={product.btwPercentage}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:border-navy ${
                    fieldErrors.btwPercentage ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value={0}>0%</option>
                  <option value={9}>9%</option>
                  <option value={21}>21%</option>
                </select>
                {fieldErrors.btwPercentage && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.btwPercentage}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categorie <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={product.categoryId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:border-navy ${
                    fieldErrors.categoryId ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                >
                  <option value={1}>Smart Locks</option>
                  <option value={2}>CCTV</option>
                  <option value={3}>Alarmsystemen</option>
                  <option value={4}>Toegangscontrole</option>
                </select>
                {fieldErrors.categoryId && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.categoryId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimale voorraad
                </label>
                <input
                  type="number"
                  name="minStock"
                  value={product.minStock}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:border-navy ${
                    fieldErrors.minStock ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {fieldErrors.minStock && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.minStock}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Huidige voorraad
                </label>
                <input
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:border-navy ${
                    fieldErrors.stock ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {fieldErrors.stock && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.stock}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschrijving
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:border-navy ${
                  fieldErrors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {fieldErrors.description && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/admin/inventory")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Annuleren
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 disabled:opacity-50"
              >
                {loading ? "Product toevoegen..." : "Product toevoegen"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 