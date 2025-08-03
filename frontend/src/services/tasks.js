const API_URL = '/api/tasks';

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

// Mock data for development
const mockTasks = [
  {
    id: 1,
    title: "Smart Lock Installatie",
    description: "Installatie van nieuwe smart lock bij hoofdingang",
    status: "open",
    userId: 2,
    user: { id: 2, name: "Test User", email: "user@btd.nl" },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    title: "CCTV Onderhoud",
    description: "Maandelijkse controle van beveiligingscamera's",
    status: "afgerond",
    feedback: "Alle camera's werken perfect",
    userId: 2,
    user: { id: 2, name: "Test User", email: "user@btd.nl" },
    completedAt: "2024-01-20T14:30:00Z",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z"
  },
  {
    id: 3,
    title: "Algemene Inspectie",
    description: "Maandelijkse veiligheidsinspectie van alle systemen",
    status: "open",
    userId: null,
    createdAt: "2024-01-25T09:00:00Z",
    updatedAt: "2024-01-25T09:00:00Z"
  },
  {
    id: 4,
    title: "Software Updates",
    description: "Controleer en installeer beschikbare updates",
    status: "open",
    userId: null,
    createdAt: "2024-01-26T14:00:00Z",
    updatedAt: "2024-01-26T14:00:00Z"
  }
];

export const taskService = {
  // Get all tasks (admin only)
  async getTasks() {
    try {
      await delay(300);
      return await makeAuthenticatedRequest(API_URL);
    } catch (error) {
      console.log('API not available, using mock tasks');
      return mockTasks;
    }
  },

  // Get tasks for current user
  async getMyTasks() {
    try {
      await delay(300);
      return await makeAuthenticatedRequest(`${API_URL}/my-tasks`);
    } catch (error) {
      console.log('API not available, using mock my tasks');
      // Return both user's tasks and general tasks
      const currentUserId = JSON.parse(localStorage.getItem('btd_user'))?.id;
      return mockTasks.filter(task => 
        task.userId === null || // Include general tasks
        (currentUserId && Number(task.userId) === Number(currentUserId)) // Include user's tasks
      );
    }
  },

  // Get tasks by user ID (admin only)
  async getTasksByUserId(userId) {
    try {
      await delay(300);
      return await makeAuthenticatedRequest(`${API_URL}/user/${userId}`);
    } catch (error) {
      console.log('API not available, using mock user tasks');
      return mockTasks.filter(task => Number(task.userId) === Number(userId));
    }
  },

  // Create new task (admin only)
  async createTask(taskData) {
    try {
      await delay(500);
      return await makeAuthenticatedRequest(API_URL, {
        method: 'POST',
        body: JSON.stringify({
          ...taskData,
          status: taskData.status || 'open'
        })
      });
    } catch (error) {
      console.log('API not available, using mock task creation');
      // Fallback to mock data
      const mockTask = {
        id: Date.now(),
        ...taskData,
        status: taskData.status || 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: taskData.userId ? {
          id: taskData.userId,
          name: "Test User",
          email: "user@btd.nl"
        } : null
      };
      mockTasks.unshift(mockTask);
      return mockTask;
    }
  },

  // Update task
  async updateTask(id, updates) {
    try {
      await delay(300);
      // Handle userId=0 for "algemeen"
      const updatedData = {
        ...updates,
        userId: updates.userId === 0 ? null : updates.userId
      };
      
      const response = await makeAuthenticatedRequest(`${API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData)
      });

      if (!response) {
        console.log('API not available, using mock task update');
        // Update mock data
        const taskIndex = mockTasks.findIndex(t => t.id === parseInt(id));
        if (taskIndex !== -1) {
          const updatedTask = {
            ...mockTasks[taskIndex],
            ...updatedData,
            user: updatedData.userId ? {
              id: updatedData.userId,
              name: "Test User",
              email: "user@btd.nl"
            } : null,
            updatedAt: new Date().toISOString()
          };
          mockTasks[taskIndex] = updatedTask;
          return updatedTask;
        }
        return null;
      }

      return response;
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  },

  // Complete task
  async completeTask(id, feedback) {
    try {
      await delay(500);
      return await makeAuthenticatedRequest(`${API_URL}/${id}/complete`, {
        method: 'PUT',
        body: JSON.stringify({ feedback })
      });
    } catch (error) {
      console.error('Complete task error:', error);
      // Update mock data
      const taskIndex = mockTasks.findIndex(t => t.id === parseInt(id));
      if (taskIndex !== -1) {
        const updatedTask = {
          ...mockTasks[taskIndex],
          status: "afgerond",
          feedback,
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockTasks[taskIndex] = updatedTask;
        return updatedTask;
      }
      throw error;
    }
  },

  // Delete task (admin only)
  async deleteTask(id) {
    try {
      await delay(300);
      const response = await makeAuthenticatedRequest(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      
      // Update mock data
      const taskIndex = mockTasks.findIndex(t => t.id === parseInt(id));
      if (taskIndex !== -1) {
        mockTasks.splice(taskIndex, 1);
      }
      
      return response?.success ?? true;
    } catch (error) {
      console.error('Delete task error:', error);
      // Update mock data
      const taskIndex = mockTasks.findIndex(t => t.id === parseInt(id));
      if (taskIndex !== -1) {
        mockTasks.splice(taskIndex, 1);
        return true;
      }
      return false;
    }
  }
}; 