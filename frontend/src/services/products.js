const API_URL = '/api/products';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("btd_token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

class ProductService {
  async getAllProducts() {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders()
  });
  if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json();
  }

  async getProductById(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error("Failed to fetch product");
      }
    return response.json();
    }

  async createProduct(productData) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
      });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create product");
    }
    return response.json();
  }

  async updateProduct(id, productData) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update product");
    }
    return response.json();
  }

  async updateStock(id, stock) {
    const response = await fetch(`${API_URL}/${id}/stock`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ stock }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update stock");
    }
    return response.json();
  }

  async deleteProduct(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete product");
    }
    return response.json();
  }

  async getLowStockProducts() {
    const response = await fetch(`${API_URL}/low-stock`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch low stock products");
    }
    return response.json();
  }

  async getCategories() {
    const response = await fetch(`${API_URL}/categories`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch categories");
    }
    return response.json();
  }

  async bulkUpload(products) {
    const response = await fetch(`${API_URL}/bulk-upload`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ products }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to bulk upload products");
    }
    return response.json();
  }
}

export const productService = new ProductService(); 