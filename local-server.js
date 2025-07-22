const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

// Serve static files
app.use(express.static('.', {
    // Don't serve .html files directly via static middleware
    index: false,
    dotfiles: 'ignore'
}));

// Redirect .html URLs to clean URLs (mimicking .htaccess)
app.get(/.*\.html$/, (req, res) => {
    const cleanUrl = req.path.replace(/\.html$/, '');
    res.redirect(301, cleanUrl);
});

// Handle clean URLs by serving the corresponding .html file
app.get('*', (req, res) => {
    let filePath;
    
    // Handle root path
    if (req.path === '/') {
        filePath = path.join(__dirname, 'index.html');
    }
    // Handle French language root
    else if (req.path === '/fr') {
        filePath = path.join(__dirname, 'index-fr.html');
    }
    // Handle specific French pages
    else if (req.path.endsWith('-fr')) {
        filePath = path.join(__dirname, req.path.substring(1) + '.html');
    }
    // Handle English pages
    else {
        filePath = path.join(__dirname, req.path.substring(1) + '.html');
    }
    
    // Check if the HTML file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        // Try to serve as static file (for CSS, JS, images, etc.)
        res.status(404).send(`
            <h1>404 - Page Not Found</h1>
            <p>The page ${req.path} could not be found.</p>
            <p>Tried to serve: ${path.basename(filePath)}</p>
            <a href="/">← Back to Home</a>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`🚀 JOYO Local Server running at:`);
    console.log(`   Local:   http://localhost:${PORT}`);
    console.log(`   Network: http://127.0.0.1:${PORT}`);
    console.log(``);
    console.log(`✅ Clean URLs working:`);
    console.log(`   http://localhost:${PORT}/menu`);
    console.log(`   http://localhost:${PORT}/about`);
    console.log(`   http://localhost:${PORT}/contact`);
    console.log(`   http://localhost:${PORT}/contact-fr`);
    console.log(`   http://localhost:${PORT}/fr`);
    console.log(``);
    console.log(`🔄 .html redirects working:`);
    console.log(`   http://localhost:${PORT}/menu.html → /menu`);
    console.log(`   http://localhost:${PORT}/contact-fr.html → /contact-fr`);
    console.log(``);
    console.log(`Press Ctrl+C to stop`);
}); 