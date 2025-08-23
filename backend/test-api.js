const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001; // Different port to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Test API is working!' });
});

// Test videos route
app.get('/api/videos', (req, res) => {
  res.json([]);
});

// Test analytics route
app.get('/api/videos/stats/analytics', (req, res) => {
  res.json({
    totalVideos: 0,
    overallAverages: { craftScore: 0, experienceScore: 0, deltaScore: 0 },
    recentAverages: { craftScore: 0, experienceScore: 0, deltaScore: 0 }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Test API running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}`);
});
