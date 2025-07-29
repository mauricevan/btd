import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productService } from "../../services/products";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Er is een fout opgetreden bij het ophalen van de producten.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      const updatedProduct = await productService.updateStock(productId, newStock);
      setProducts(products.map(product =>
        product.id === productId ? updatedProduct : product
      ));
      showToast("Voorraad succesvol bijgewerkt");
    } catch (err) {
      console.error("Error updating stock:", err);
      showToast("Er ging iets mis bij het bijwerken van de voorraad", "error");
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Voorraadbeheer</h1>
        <Link
          to="/admin/inventory/add"
          className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
          Product toevoegen
        </Link>
        </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
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
          ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Artikelnummer</th>
                  <th className="px-4 py-3 text-left">Naam</th>
                  <th className="px-4 py-3 text-right">Inkoopprijs</th>
                  <th className="px-4 py-3 text-right">Verkoopprijs</th>
                  <th className="px-4 py-3 text-right">BTW %</th>
                  <th className="px-4 py-3 text-center">Voorraad</th>
                  <th className="px-4 py-3 text-center">Min. voorraad</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
              <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{product.articleNumber}</td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3 text-right">€{product.purchasePrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">€{product.sellingPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">{product.btwPercentage}%</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                          <button
                          onClick={() => handleUpdateStock(product.id, Math.max(0, product.stock - 1))}
                          className="text-gray-500 hover:text-navy"
                          >
                          -
                          </button>
                        <span className="w-12 text-center">{product.stock}</span>
                          <button
                          onClick={() => handleUpdateStock(product.id, product.stock + 1)}
                          className="text-gray-500 hover:text-navy"
                          >
                          +
                          </button>
                        </div>
                      </td>
                    <td className="px-4 py-3 text-center">{product.minStock}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock <= 0
                            ? "bg-red-100 text-red-800"
                            : product.stock <= product.minStock
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.stock <= 0
                          ? "Niet op voorraad"
                          : product.stock <= product.minStock
                          ? "Bijna op"
                          : "Op voorraad"}
                      </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
            </div>
          )}

      {toast && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded shadow-lg ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
} 