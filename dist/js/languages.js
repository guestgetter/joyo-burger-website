/**
 * JOYO Burger - Language Configuration System
 * This file manages translations and language switching functionality
 */

// Store translations globally
let translations = {};
let currentLanguage = 'en';

/**
 * Initialize the language system
 * @param {string} defaultLang - The default language to use
 */
function initLanguageSystem(defaultLang = 'en') {
    // Set initial language based on HTML lang attribute or localStorage
    const savedLang = localStorage.getItem('preferred_language');
    const htmlLang = document.documentElement.lang.toLowerCase();
    
    // Set current language priority: 1. saved preference, 2. HTML lang attribute, 3. default
    currentLanguage = savedLang ? savedLang.toLowerCase() : htmlLang || defaultLang;
    
    // Load translations for the current language
    loadTranslations(currentLanguage);
    
    // Initialize language toggle buttons
    initLanguageToggle();
}

/**
 * Load translations for a specific language
 * @param {string} lang - Language code to load (e.g., 'en', 'fr')
 */
async function loadTranslations(lang) {
    try {
        const response = await fetch(`/js/locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${lang} translations`);
        }
        translations = await response.json();
        console.log(`Loaded ${lang} translations`);
    } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to empty translations object
        translations = {};
    }
}

/**
 * Get a translated string by its key
 * @param {string} key - Translation key in dot notation (e.g., 'menu.burger.title')
 * @param {object} params - Optional parameters to replace placeholders in translation
 * @returns {string} - Translated string or the key if translation not found
 */
function t(key, params = {}) {
    // Split the key by dots to access nested properties
    const keys = key.split('.');
    
    // Navigate through the translations object
    let value = translations;
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            // If key not found, return the key itself
            return key;
        }
    }
    
    // If value is not a string, return the key
    if (typeof value !== 'string') {
        return key;
    }
    
    // Replace parameters in the translated string
    return Object.entries(params).reduce((str, [param, val]) => {
        return str.replace(new RegExp(`{{${param}}}`, 'g'), val);
    }, value);
}

/**
 * Switch the current language
 * @param {string} lang - Language code to switch to (e.g., 'en', 'fr')
 */
function switchLanguage(lang) {
    if (lang === currentLanguage) {
        return; // Already in this language
    }
    
    // Update current language
    currentLanguage = lang;
    
    // Save preference in localStorage
    localStorage.setItem('preferred_language', lang);
    
    // Get current page and determine target page
    let currentPath = window.location.pathname;
    let currentPage = currentPath.split('/').pop();
    
    // If we're on any page other than index
    if (currentPage && !currentPage.includes('index')) {
        // Just change language suffix
        let baseName = currentPage.split('.')[0].replace(/-fr$/, '');
        let targetPage = baseName + (lang === 'fr' ? '-fr' : '') + '.html';
        window.location.href = targetPage;
    } else {
        // Default index page behavior
        let targetPage = lang === 'fr' ? 'index-fr.html' : 'index.html';
        window.location.href = targetPage;
    }
}

/**
 * Initialize language toggle buttons
 */
function initLanguageToggle() {
    const langToggles = document.querySelectorAll('.language-toggle');
    
    langToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the selected language
            const lang = this.textContent.trim().toLowerCase();
            
            // Switch language if not already active
            if (!this.classList.contains('active')) {
                switchLanguage(lang);
            }
        });
    });
}

// Export for global use
window.t = t;
window.switchLanguage = switchLanguage;
window.initLanguageSystem = initLanguageSystem; 