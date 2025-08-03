// Helper functions for authentication
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`http://localhost:4000${url}`, config);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

const API_URL = "/api/workorders";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

class WorkOrderService {
  async getAllWorkOrders() {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error("Failed to fetch work orders");
    }
    return response.json();
  }

  async getWorkOrderById(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error("Failed to fetch work order");
    }
    return response.json();
  }

  async createWorkOrder(workOrderData) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
        body: JSON.stringify(workOrderData),
      });
    if (!response.ok) {
      throw new Error("Failed to create work order");
    }
    return response.json();
  }

  async updateWorkOrder(id, workOrderData) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(workOrderData),
    });
    if (!response.ok) {
      throw new Error("Failed to update work order");
    }
    return response.json();
  }

  async updateWorkOrderStatus(id, status) {
    const response = await fetch(`${API_URL}/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
    if (!response.ok) {
      throw new Error("Failed to update work order status");
    }
    return response.json();
  }

  async deleteWorkOrder(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to delete work order");
    }
    return response.json();
    }
}

export const workOrderService = new WorkOrderService();

// Mock data for development (fallback)
const mockWorkOrders = [
  {
    id: 1,
    customerName: 'Test Klant',
    phone: '06-12345678',
    email: 'test@klant.nl',
    description: 'Test werkorder',
    date: new Date().toISOString(),
    status: 'open',
    total: 150.00,
    items: [
      {
        name: 'Test Artikel',
        quantity: 2,
        price: 75.00,
        vatPercentage: 21
      }
    ]
  }
];

// Fallback functions for when backend is not available
export const workOrderServiceMock = {
  async createWorkOrder(workOrderData) {
    console.log('Mock: Creating work order', workOrderData);
    return {
      workOrder: { id: Date.now(), ...workOrderData },
      task: { id: Date.now(), title: `Werkorder: ${workOrderData.customerName}` },
      message: 'Werkorder succesvol aangemaakt (mock)'
    };
  },

  async getWorkOrders() {
    return mockWorkOrders;
  },

  async getWorkOrder(id) {
    return mockWorkOrders.find(wo => wo.id === parseInt(id));
  },

  async updateWorkOrderStatus(id, status) {
    console.log('Mock: Updating work order status', { id, status });
    return { id: parseInt(id), status };
  },
};

// Export the appropriate service based on environment
export default workOrderService; 