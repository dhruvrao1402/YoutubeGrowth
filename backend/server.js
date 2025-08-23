const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Supabase connection
const supabase = require('./supabase');

// Routes
app.use('/api/auth', require('./routes/auth').router);
app.use('/api/videos', require('./routes/videos'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'YouTube Craft Tracker API (Supabase)' });
});

// Simple test endpoint (no database)
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working!', timestamp: new Date().toISOString() });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    // Test Supabase connection
    const { data, error } = await supabase
      .from('videos')
      .select('id', { count: 'exact', head: true });
    
    if (error) throw error;
    
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
});
