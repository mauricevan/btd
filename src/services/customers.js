const API_URL = 'http://localhost:4000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('btd_token');
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid, clear it
      localStorage.removeItem('btd_token');
      localStorage.removeItem('btd_user');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Simulate API delay for better UX
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data voor fallback
let customers = [
  {
    id: 1,
    name: "Jan Jansen",
    email: "jan.jansen@email.nl",
    phone: "06-12345678",
    address: "Hoofdstraat 123",
    city: "Dordrecht",
    postalCode: "3311 AA",
    notes: "Klant sinds 2020\nInteresse in smart locks\nLaatste contact: 15-01-2024",
    products: [],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: 2,
    name: "Bedrijf XYZ BV",
    email: "info@bedrijfxyz.nl",
    phone: "078-1234567",
    address: "Industrieweg 45",
    city: "Rotterdam",
    postalCode: "3000 AB",
    notes: "Grote klant\nJaarlijks contract\nContactpersoon: Piet de Vries",
    products: [],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10"
  }
];

export const customerService = {
  // Haal alle klanten op
  async getCustomers() {
    try {
      await delay(300);
      return await makeAuthenticatedRequest(`${API_URL}/customers`);
    } catch (error) {
      console.log('API not available, using mock customers');
      return [...customers];
    }
  },

  // Haal één klant op
  async getCustomer(id) {
    try {
      await delay(200);
      return await makeAuthenticatedRequest(`${API_URL}/customers/${id}`);
    } catch (error) {
      console.log('API not available, using mock customer');
      const customer = customers.find(c => c.id === parseInt(id));
      if (!customer) {
        throw new Error('Klant niet gevonden');
      }
      return customer;
    }
  },

  // Voeg nieuwe klant toe
  async addCustomer(customerData) {
    try {
      await delay(500);
      return await makeAuthenticatedRequest(`${API_URL}/customers`, {
        method: 'POST',
        body: JSON.stringify(customerData)
      });
    } catch (error) {
      console.error('Add customer error:', error);
      throw error;
    }
  },

  // Update klant
  async updateCustomer(id, customerData) {
    try {
      await delay(300);
      return await makeAuthenticatedRequest(`${API_URL}/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(customerData)
      });
    } catch (error) {
      console.error('Update customer error:', error);
      throw error;
    }
  },

  // Verwijder klant
  async deleteCustomer(id) {
    try {
      await delay(300);
      const response = await makeAuthenticatedRequest(`${API_URL}/customers/${id}`, {
        method: 'DELETE'
      });
      return response.success;
    } catch (error) {
      console.error('Delete customer error:', error);
      return false;
    }
  },

  // Zoek klanten
  async searchCustomers(query) {
    try {
      await delay(300);
      return await makeAuthenticatedRequest(`${API_URL}/customers/search/${query}`);
    } catch (error) {
      console.log('API not available, using mock search');
      return customers.filter(customer =>
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.email.toLowerCase().includes(query.toLowerCase()) ||
        customer.phone?.includes(query) ||
        customer.city?.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  // Voeg product toe aan klant
  async addProductToCustomer(customerId, productId) {
    try {
      await delay(300);
      return await makeAuthenticatedRequest(`${API_URL}/customers/${customerId}/products`, {
        method: 'POST',
        body: JSON.stringify({ productId })
      });
    } catch (error) {
      console.error('Add product to customer error:', error);
      throw error;
    }
  },

  // Verwijder product van klant
  async removeProductFromCustomer(customerId, productId) {
    try {
      await delay(300);
      const response = await makeAuthenticatedRequest(`${API_URL}/customers/${customerId}/products/${productId}`, {
        method: 'DELETE'
      });
      return response.success;
    } catch (error) {
      console.error('Remove product from customer error:', error);
      return false;
    }
  }
}; 