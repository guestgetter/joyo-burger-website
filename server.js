const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Handle SPA routing - serve index.html for any non-asset requests
app.get('*', (req, res) => {
  // Check if it's a request for an HTML file
  if (req.path.endsWith('.html')) {
    res.sendFile(path.join(__dirname, req.path));
  } else if (req.path === '/' || !req.path.includes('.')) {
    // Serve index.html for root or routes without extensions
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    // Let express.static handle other file requests
    res.status(404).send('File not found');
  }
});

app.listen(PORT, () => {
  console.log(`🍔 JOYO Burger website is running on port ${PORT}`);
  console.log(`🌐 Open http://localhost:${PORT} to view the site`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 Server shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 Server shutting down gracefully...');
  process.exit(0);
}); 