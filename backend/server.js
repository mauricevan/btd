const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const auth = require('./auth');
const tasks = require('./tasks');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = auth.login(email, password);
  if (user) {
    res.json(user);
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Register
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  const user = auth.register(email, password);
  if (user) {
    res.json(user);
  } else {
    res.status(400).json({ error: 'User already exists' });
  }
});

// Get all users
app.get('/api/users', (req, res) => {
  res.json(auth.getUsers());
});

// Update user
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updates = req.body;
  const user = auth.updateUser(id, updates);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const ok = auth.deleteUser(id);
  if (ok) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks.getTasks());
});

// Get tasks by userId
app.get('/api/tasks/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  res.json(tasks.getTasksByUserId(userId));
});

// Add a task
app.post('/api/tasks', (req, res) => {
  const task = tasks.addTask(req.body);
  res.json(task);
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.updateTask(id, req.body);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  tasks.deleteTask(id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
}); 