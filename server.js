const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Use Express built-in JSON middleware instead of body-parser
app.use(express.static(path.join(__dirname, 'public')));

// Load routes with error handling
try {
  const routes = require('./src/api/routes');
  app.use('/api', routes);
  console.log('Routes loaded successfully');
} catch (error) {
  console.error('Error loading routes:', error);
}

// Serve index.html as fallback
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} in your browser`);
});