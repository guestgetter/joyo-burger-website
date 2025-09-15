/*
 Minimal injector to ensure GA4 and GTM snippets exist on all HTML pages.
 - Inserts GA4 + GTM into <head> just after <meta viewport> when missing
 - Inserts GTM noscript immediately after opening <body> when missing
 - Operates on all top-level .html files in the project root (not dist/)
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const GA4_ID = 'G-DKD3TY3G06';
const GTM_ID = 'GTM-M6ZP2KC6';

const HEAD_SNIPPET = `\n    <!-- Google tag (gtag.js) -->\n    <script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_ID}"></script>\n    <script>\n      window.dataLayer = window.dataLayer || [];\n      function gtag(){dataLayer.push(arguments);}\n      gtag('js', new Date());\n      gtag('config', '${GA4_ID}');\n    </script>\n    \n    <!-- Google Tag Manager -->\n    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\n    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\n    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n    })(window,document,'script','dataLayer','${GTM_ID}');</script>\n    <!-- End Google Tag Manager -->\n`;

const BODY_SNIPPET = `\n    <!-- Google Tag Manager (noscript) -->\n    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n    <!-- End Google Tag Manager (noscript) -->\n`;

function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  const hasGA4 = /googletagmanager\.com\/gtag\/js\?id=/.test(html) || /gtag\(\s*'config'\s*,/.test(html);
  const hasGTM = /googletagmanager\.com\/gtm\.js\?id=/.test(html);
  const hasNoScript = /<iframe\s+src="https:\/\/www\.googletagmanager\.com\/ns\.html\?id=/.test(html);

  // Insert head scripts just after <head> or after viewport meta if present
  if (!hasGA4 || !hasGTM) {
    const headOpenIdx = html.indexOf('<head');
    if (headOpenIdx !== -1) {
      const headStartClose = html.indexOf('>', headOpenIdx);
      let insertionPoint = headStartClose + 1;
      const viewportIdx = html.indexOf('name="viewport"', headStartClose);
      if (viewportIdx !== -1) {
        const viewportTagEnd = html.indexOf('>', viewportIdx);
        if (viewportTagEnd !== -1) insertionPoint = viewportTagEnd + 1;
      }
      html = html.slice(0, insertionPoint) + HEAD_SNIPPET + html.slice(insertionPoint);
    }
  }

  // Insert body noscript immediately after <body>
  if (!hasNoScript) {
    const bodyOpenIdx = html.indexOf('<body');
    if (bodyOpenIdx !== -1) {
      const bodyStartClose = html.indexOf('>', bodyOpenIdx);
      const insertionPoint = bodyStartClose + 1;
      html = html.slice(0, insertionPoint) + BODY_SNIPPET + html.slice(insertionPoint);
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Injected GTM/GA4 into ${path.basename(filePath)}`);
}

function run() {
  const files = fs.readdirSync(ROOT)
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(ROOT, f))
    .filter(p => !p.includes('/dist/'));

  files.forEach(processFile);
}

run();


