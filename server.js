const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle clean URLs (remove .html extension)
app.get('*', (req, res) => {
  let filePath = req.path;
  
  // If the path doesn't have an extension, try adding .html
  if (!path.extname(filePath) && filePath !== '/') {
    filePath += '.html';
  }
  
  // If it's the root, serve index.html
  if (filePath === '/' || filePath === '/index.html') {
    res.sendFile(path.join(__dirname, 'index.html'));
    return;
  }
  
  // Try to serve the file
  res.sendFile(path.join(__dirname, filePath), (err) => {
    if (err) {
      // If file not found, serve index.html (for SPA-like behavior)
      res.sendFile(path.join(__dirname, 'index.html'));
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`JOYO Burger website running on port ${port}`);
}); 