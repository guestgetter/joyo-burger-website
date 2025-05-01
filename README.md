# JOYO Burger Website

This repository contains the code for the JOYO Burger restaurant website. The site is built with HTML, CSS, and JavaScript, following modern web development practices and a component-based architecture.

## Project Structure

```
JOYO Burger Website/
├── css/                    # CSS files
│   ├── components/         # Component-specific CSS
│   │   ├── header.css      # Header styles
│   │   ├── footer.css      # Footer styles
│   │   ├── menu-updated.css # Updated menu styles with brand colors
│   │   ├── menu.css        # DEPRECATED - Use menu-updated.css instead
│   │   └── reset.css       # CSS reset
│   ├── variables.css       # CSS variables and theming (JOYO brand colors)
│   ├── styles.css          # Main stylesheet
│   ├── responsive.css      # Responsive design rules
│   ├── menu.css            # DEPRECATED - Use components/menu-updated.css
│   └── animations.css      # Animation definitions
├── js/                     # JavaScript files
│   ├── locales/            # Language translation files
│   │   ├── en.json         # English translations
│   │   └── fr.json         # French translations
│   ├── main.js             # Main JS functionality
│   ├── languages.js        # Language system
│   └── menu.js             # Menu-specific functionality
├── JOYO - Images/          # Image assets
├── JOYO - Fonts/           # Font files
└── *.html                  # HTML pages
```

## Brand Guidelines

### Colors

JOYO Burger uses specific brand colors that should be maintained across the website:

**Primary Colors:**
- Noir (Black): #000000 
- Ocre (Ochre): #CA831A

**Secondary Colors:**
- Jaune pâle (Light Yellow): #FEEDA7
- Rouge-orangé (Orange-Red): #FF6239
- Rose (Pink): #FFC8BE
- Vert forêt (Forest Green): #18423D

### Typography

The website uses the following brand fonts:
- Headings: DINRound (various weights)
- Body text: Founders Grotesk (various weights)

## Development Guidelines

### Adding New Pages

1. Create a new HTML file in the root directory
2. Copy the structure from an existing page (header/footer)
3. Create both English (`page.html`) and French (`page-fr.html`) versions
4. Link the page in the navigation menus of all pages
5. Ensure consistent use of brand fonts and colors across all pages

### Adding New Menu Items

1. Add the menu item to both language versions (`menu.html` and `menu-fr.html`)
2. Add translations to `js/locales/en.json` and `js/locales/fr.json` using the following format:

```json
"menu": {
  "items": {
    "newItemKey": {
      "name": "New Item Name",
      "description": "New item description"
    }
  }
}
```

### CSS Architecture

- Use CSS variables for consistent styling
- Follow the BEM naming convention (Block, Element, Modifier)
- Place component-specific styles in dedicated files in the `css/components/` directory
- Use responsive design practices (mobile-first approach)
- Always use JOYO's brand colors from the variables.css file

### JavaScript Conventions

- Use ES6+ syntax
- Include descriptive comments for functions and complex logic
- Separate concerns (UI, data management, events)
- Handle errors gracefully
- Use the translation system for all user-facing text

### Translation System

The website uses a custom translation system to handle multilingual content:

1. Define translations in `js/locales/*.json` files
2. Use the `t()` function to retrieve translations: `t('section.key')`
3. Include appropriate language attribute in HTML tag: `<html lang="en">` or `<html lang="fr">`

### Browser Compatibility

- Support latest versions of Chrome, Firefox, Safari, and Edge
- Test responsiveness on various device sizes
- Ensure accessibility compliance

## Code Maintenance

Regular code maintenance tasks should include:

1. **Removing deprecated files**: Files marked as DEPRECATED should eventually be removed when no longer referenced
2. **Consistent formatting**: Maintain consistent code formatting across all files
3. **Proper documentation**: Keep documentation updated with any changes to the codebase
4. **CSS organization**: Group related CSS rules together and use descriptive comments
5. **Image optimization**: Regularly optimize images for web
6. **Dependency updates**: Keep external libraries updated

## Deployment

The website is deployed via standard static hosting. Any changes to the main branch will be automatically deployed after review.

## Development Setup

1. Clone the repository
2. No build process is required - simply open the HTML files in a browser
3. For local development with dynamic features, use a local server:
   ```
   python3 -m http.server 8000
   ```
   or any other local development server

## Contributing

1. Create feature branches from `main`
2. Make changes following the guidelines above
3. Test thoroughly
4. Submit a pull request with a clear description of the changes
5. Ensure no linting issues or errors are present

## License

© 2023 Joyo™ burger. All Rights Reserved. 