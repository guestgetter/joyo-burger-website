/**
 * JOYO Burger - Menu Page Functionality
 * 
 * This file handles all interactive functionality specific to the menu page,
 * including category navigation, scrolling behavior, and accessibility features.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the language system
    if (typeof initLanguageSystem === 'function') {
        initLanguageSystem();
    }

    // Initialize menu-specific functionality
    initMenuNavigation();
    setupKeyboardNavigation();
    
    // Set up menu items with translation if available
    setupMenuTranslations();
});

/**
 * Initialize menu category navigation
 */
function initMenuNavigation() {
    const menuCategories = document.querySelectorAll('.menu-category');
    const menuSections = document.querySelectorAll('.menu-section');
    
    if (menuCategories.length === 0 || menuSections.length === 0) return;
    
    // Add click event to each menu category
    menuCategories.forEach(category => {
        category.addEventListener('click', function() {
            // Get target category
            const targetCategory = this.getAttribute('data-category');
            
            // Update active states
            menuCategories.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            menuSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetCategory) {
                    section.classList.add('active');
                    
                    // Scroll to top of section on mobile
                    if (window.innerWidth < 992) {
                        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - 70;
                        window.scrollTo({
                            top: sectionTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    });
    
    // Handle scroll based activation for mobile
    if (window.innerWidth < 992) {
        window.addEventListener('scroll', debounce(function() {
            const scrollPosition = window.pageYOffset + 100;
            
            // Find which section is in view
            menuSections.forEach(section => {
                if (section.classList.contains('active')) {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        const categoryId = section.id;
                        
                        // Update sidebar navigation
                        menuCategories.forEach(item => {
                            if (item.getAttribute('data-category') === categoryId) {
                                if (!item.classList.contains('active')) {
                                    menuCategories.forEach(cat => cat.classList.remove('active'));
                                    item.classList.add('active');
                                    
                                    // Scroll category into view in the horizontal menu
                                    const categoriesContainer = document.querySelector('.menu-categories ul');
                                    const itemLeft = item.offsetLeft;
                                    categoriesContainer.scrollTo({
                                        left: itemLeft - 20,
                                        behavior: 'smooth'
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }, 100));
    }
}

/**
 * Setup keyboard navigation for accessibility
 */
function setupKeyboardNavigation() {
    const menuCategories = document.querySelectorAll('.menu-category');
    
    menuCategories.forEach(category => {
        category.setAttribute('tabindex', '0');
        
        category.addEventListener('keydown', function(e) {
            // Enter or Space key
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Setup menu translations using the translations system
 */
function setupMenuTranslations() {
    // Only attempt to translate if the t function is available
    if (typeof window.t !== 'function') return;
    
    try {
        // Translate menu category names
        document.querySelectorAll('.menu-category span').forEach(span => {
            const category = span.closest('.menu-category').getAttribute('data-category');
            const key = `menu.categories.${category}`;
            const translation = window.t(key);
            
            // Only update if we got a translation
            if (translation !== key) {
                span.textContent = translation;
            }
        });
        
        // Translate section headers
        document.querySelectorAll('.section-header h2').forEach(header => {
            const section = header.closest('.menu-section').id;
            const key = `menu.sections.${section}.title`;
            const translation = window.t(key);
            
            if (translation !== key) {
                header.textContent = translation;
            }
        });
        
        // Translate section descriptions
        document.querySelectorAll('.section-header p:not(.note)').forEach(desc => {
            const section = desc.closest('.menu-section').id;
            const key = `menu.sections.${section}.description`;
            const translation = window.t(key);
            
            if (translation !== key) {
                desc.textContent = translation;
            }
        });
        
        // Translate footer note
        document.querySelectorAll('.section-footer p').forEach(footer => {
            const key = 'menu.footer.glutenFree';
            const translation = window.t(key);
            
            if (translation !== key) {
                footer.textContent = translation;
            }
        });
    } catch (error) {
        console.error('Error setting up menu translations:', error);
    }
}

/**
 * Debounce function to limit scroll event firing
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
} 