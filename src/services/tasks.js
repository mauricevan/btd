const API_URL = 'http://localhost:4000/api';

export async function getAllTasks() {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) return [];
  return await res.json();
}

export async function getTasksByUserId(userId) {
  const res = await fetch(`${API_URL}/tasks/user/${userId}`);
  if (!res.ok) return [];
  return await res.json();
}

export async function addTask(task) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  if (!res.ok) return null;
  return await res.json();
}

export async function updateTask(id, updates) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) return null;
  return await res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE' });
  if (!res.ok) return false;
  return true;
} 