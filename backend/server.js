const express = require('express');
const cors = require('cors');
const { testConnection, initializeDatabase } = require('./db');
const config = require('./config');

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customers');
const notificationRoutes = require('./routes/notifications');
const workOrderRoutes = require('./routes/workorders');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'BTD Dordrecht API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/workorders', workOrderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await testConnection();
    
    // Initialize database with seed data
    await initializeDatabase();
    
    // Start server
    const PORT = config.server.port;
    app.listen(PORT, () => {
      console.log(`🚀 BTD Dordrecht Backend API running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
      console.log(`📋 Task endpoints: http://localhost:${PORT}/api/tasks`);
      console.log(`📦 Product endpoints: http://localhost:${PORT}/api/products`);
      console.log(`👥 Customer endpoints: http://localhost:${PORT}/api/customers`);
      console.log(`🔔 Notification endpoints: http://localhost:${PORT}/api/notifications`);
      console.log(`📋 Work order endpoints: http://localhost:${PORT}/api/workorders`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 