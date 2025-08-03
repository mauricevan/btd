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
let notifications = [
  {
    id: 1,
    type: 'task_completed',
    title: 'Taak voltooid',
    message: 'Taak "Smart Lock Installatie" is voltooid door Test User',
    isRead: false,
    userId: 1,
    user: { id: 1, name: 'Admin', email: 'admin@btd.nl' },
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 2,
    type: 'low_stock',
    title: 'Lage voorraad',
    message: 'Product "CCTV Camera HD" heeft lage voorraad (3 stuks)',
    isRead: true,
    userId: 1,
    user: { id: 1, name: 'Admin', email: 'admin@btd.nl' },
    createdAt: '2024-01-19T10:15:00Z'
  }
];

export const notificationService = {
  // Haal alle notificaties op (admin only)
  async getNotifications() {
    try {
      await delay(300);
      return await makeAuthenticatedRequest(`${API_URL}/notifications`);
    } catch (error) {
      console.log('API not available, using mock notifications');
      return [...notifications];
    }
  },

  // Haal notificaties voor huidige gebruiker op
  async getMyNotifications() {
    try {
      await delay(300);
      return await makeAuthenticatedRequest(`${API_URL}/notifications/my-notifications`);
    } catch (error) {
      console.log('API not available, using mock my notifications');
      return notifications.filter(n => n.userId === 1); // Admin user
    }
  },

  // Haal aantal ongelezen notificaties op
  async getUnreadCount() {
    try {
      await delay(200);
      const response = await makeAuthenticatedRequest(`${API_URL}/notifications/unread-count`);
      return response.count;
    } catch (error) {
      console.log('API not available, using mock unread count');
      return notifications.filter(n => !n.isRead && n.userId === 1).length;
    }
  },

  // Markeer notificatie als gelezen
  async markAsRead(id) {
    try {
      await delay(300);
      return await makeAuthenticatedRequest(`${API_URL}/notifications/${id}/read`, {
        method: 'PUT'
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  },

  // Markeer alle notificaties als gelezen
  async markAllAsRead() {
    try {
      await delay(300);
      return await makeAuthenticatedRequest(`${API_URL}/notifications/mark-all-read`, {
        method: 'PUT'
      });
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  },

  // Verwijder notificatie
  async deleteNotification(id) {
    try {
      await delay(300);
      const response = await makeAuthenticatedRequest(`${API_URL}/notifications/${id}`, {
        method: 'DELETE'
      });
      return response.success;
    } catch (error) {
      console.error('Delete notification error:', error);
      return false;
    }
  },

  // Maak nieuwe notificatie (admin only)
  async createNotification(notificationData) {
    try {
      await delay(300);
      return await makeAuthenticatedRequest(`${API_URL}/notifications`, {
        method: 'POST',
        body: JSON.stringify(notificationData)
      });
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }
}; 