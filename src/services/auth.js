const API_URL = '/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('btd_token');
};

// Helper function to set auth token in localStorage
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('btd_token', token);
  } else {
    localStorage.removeItem('btd_token');
  }
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
      setAuthToken(null);
      localStorage.removeItem('btd_user');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    // Store token and user data
    setAuthToken(data.token);
    localStorage.setItem('btd_user', JSON.stringify(data.user));
    
    return { user: data.user, token: data.token };
  } catch (error) {
    console.log('API not available, using mock login');
    // Fallback to mock login for development
    if (email === 'admin@btd.nl' && password === 'admin') {
      const mockUser = { id: 1, email: 'admin@btd.nl', role: 'admin', name: 'Admin' };
      const mockToken = 'mock-token-admin';
      localStorage.setItem('btd_user', JSON.stringify(mockUser));
      setAuthToken(mockToken);
      return { user: mockUser, token: mockToken };
    }
    if (email === 'user@btd.nl' && password === 'user') {
      const mockUser = { id: 2, email: 'user@btd.nl', role: 'user', name: 'Test User' };
      const mockToken = 'mock-token-user';
      localStorage.setItem('btd_user', JSON.stringify(mockUser));
      setAuthToken(mockToken);
      return { user: mockUser, token: mockToken };
    }
    if (email === 'user@btd.nl' && password === '123') {
      const mockUser = { id: 2, email: 'user@btd.nl', role: 'user', name: 'Test User' };
      const mockToken = 'mock-token-user';
      localStorage.setItem('btd_user', JSON.stringify(mockUser));
      setAuthToken(mockToken);
      return { user: mockUser, token: mockToken };
    }
    return null;
  }
}

export async function register(email, password, name) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    // Store token and user data
    setAuthToken(data.token);
    localStorage.setItem('btd_user', JSON.stringify(data.user));
    
    return data.user;
  } catch (error) {
    console.error('Register error:', error);
    return null;
  }
}

export async function getUsers() {
  try {
    return await makeAuthenticatedRequest(`${API_URL}/auth/users`);
  } catch (error) {
    console.log('API not available, using mock users');
    // Fallback to mock data
    return [
      { id: 1, name: 'Admin', email: 'admin@btd.nl', role: 'admin' },
      { id: 2, name: 'Gebruiker', email: 'gebruiker@btd.nl', role: 'user' },
      { id: 3, name: 'Test User', email: 'test@btd.nl', role: 'user' }
    ];
  }
}

export async function updateUser(id, updates) {
  try {
    return await makeAuthenticatedRequest(`${API_URL}/auth/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  } catch (error) {
    console.error('Update user error:', error);
    return null;
  }
}

export async function deleteUser(id) {
  try {
    const response = await makeAuthenticatedRequest(`${API_URL}/auth/users/${id}`, {
      method: 'DELETE'
    });
    return response.success;
  } catch (error) {
    console.error('Delete user error:', error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    return await makeAuthenticatedRequest(`${API_URL}/auth/me`);
  } catch (error) {
    console.log('API not available, using stored user data');
    // Fallback to stored user data
    const stored = localStorage.getItem('btd_user');
    return stored ? JSON.parse(stored) : null;
  }
}

export function logout() {
  setAuthToken(null);
  localStorage.removeItem('btd_user');
} 