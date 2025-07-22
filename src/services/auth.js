const API_URL = 'http://localhost:4000/api';

export async function login(email, password) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.log('API not available, using mock login');
    // Mock login for testing
    if (email === 'admin@btd.nl' && password === 'admin') {
      return { id: 1, email: 'admin@btd.nl', role: 'admin' };
    }
    if (email === 'user@btd.nl' && password === 'user') {
      return { id: 2, email: 'user@btd.nl', role: 'user' };
    }
    return null;
  }
}

export async function register(email, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) return null;
  return await res.json();
}

export async function getUsers() {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) return [];
  return await res.json();
}

export async function updateUser(id, updates) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) return null;
  return await res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE' });
  if (!res.ok) return false;
  return true;
} 