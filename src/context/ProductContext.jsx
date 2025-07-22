import React, { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services/products';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  // Laad alle producten
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Laad categorieën
  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  // Laad één product
  const loadProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProduct(id);
      setSelectedProduct(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Voeg nieuw product toe
  const addProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const newProduct = await productService.addProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      await loadCategories(); // Herlaad categorieën
      return newProduct;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const updateProduct = async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProduct = await productService.updateProduct(id, productData);
      setProducts(prev => prev.map(p => p.id === parseInt(id) ? updatedProduct : p));
      if (selectedProduct && selectedProduct.id === parseInt(id)) {
        setSelectedProduct(updatedProduct);
      }
      await loadCategories(); // Herlaad categorieën
      return updatedProduct;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Verwijder product
  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== parseInt(id)));
      if (selectedProduct && selectedProduct.id === parseInt(id)) {
        setSelectedProduct(null);
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Zoek producten
  const searchProducts = async (query) => {
    if (!query.trim()) {
      await loadProducts();
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const results = await productService.searchProducts(query);
      setProducts(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter producten op categorie
  const filterProductsByCategory = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const results = await productService.filterProductsByCategory(category);
      setProducts(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter producten met lage voorraad
  const getLowStockProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await productService.getLowStockProducts();
      setProducts(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update voorraad
  const updateStock = async (id, newStock) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProduct = await productService.updateStock(id, newStock);
      setProducts(prev => prev.map(p => p.id === parseInt(id) ? updatedProduct : p));
      if (selectedProduct && selectedProduct.id === parseInt(id)) {
        setSelectedProduct(updatedProduct);
      }
      return updatedProduct;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Bereken prijs inclusief BTW
  const calculatePriceInclBtw = (priceExcl, btwPercentage) => {
    return productService.calculatePriceInclBtw(priceExcl, btwPercentage);
  };

  // Controleer lage voorraad
  const isLowStock = (stock, minStock) => {
    return productService.isLowStock(stock, minStock);
  };

  // Clear error
  const clearError = () => setError(null);

  // Clear selected product
  const clearSelectedProduct = () => setSelectedProduct(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const value = {
    products,
    selectedProduct,
    categories,
    loading,
    error,
    loadProducts,
    loadProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterProductsByCategory,
    getLowStockProducts,
    updateStock,
    calculatePriceInclBtw,
    isLowStock,
    clearError,
    clearSelectedProduct,
    setSelectedProduct
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
} 