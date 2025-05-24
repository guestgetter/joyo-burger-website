/**
 * JOYO Burger Website - Optimized Main JavaScript
 * Performance-focused version with minimal impact on page load
 */

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Cache DOM elements to avoid repeated queries
const DOM = {
    body: document.body,
    header: null,
    categoriesScroll: null,
    gallerySlides: null,
    galleryDots: null,
    testimonials: null,
    testimonialDots: null
};

// Initialize DOM cache when ready
function cacheDOMElements() {
    DOM.header = document.querySelector('header');
    DOM.categoriesScroll = document.querySelector('.categories-scroll');
    DOM.gallerySlides = document.querySelectorAll('.gallery-slide');
    DOM.galleryDots = document.querySelectorAll('.gallery-dot');
    DOM.testimonials = document.querySelectorAll('.testimonial');
    DOM.testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements first
    cacheDOMElements();
    
    // Initialize components with minimal impact
    requestAnimationFrame(() => {
    initMobileMenu();
    initSmoothScrolling();
    initCategoriesScroll();
    initTestimonials();
    initPurposeGallery();
    
        // Defer non-critical animations
        setTimeout(() => {
            initScrollAnimations();
    fixAllHeadings();
        }, 100);
    });
});

/**
 * Optimized mobile menu with robust initialization
 */
function initMobileMenu() {
    const mobileNavToggle = document.querySelector('.joyo-mobile-nav-toggle');
    const mobileNav = document.querySelector('.joyo-mobile-nav');
    const mobileNavClose = document.querySelector('.joyo-mobile-nav-close');
    
    if (!mobileNavToggle || !mobileNav) {
        console.warn('Mobile menu elements not found on this page');
        return;
    }
    
    let isMenuOpen = false;
    
    function closeMenu() {
        isMenuOpen = false;
        mobileNavToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        DOM.body.classList.remove('mobile-menu-open');
        toggleAnimations(false);
    }
    
    function openMenu() {
        isMenuOpen = true;
        mobileNavToggle.classList.add('active');
        mobileNav.classList.add('active');
        DOM.body.classList.add('mobile-menu-open');
        toggleAnimations(true);
    }
    
    // Add click event to toggle button
    mobileNavToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }, { passive: false });
    
    // Add click event to close button
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
        }, { passive: false });
    }
        
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !mobileNav.contains(e.target) && !mobileNavToggle.contains(e.target)) {
            closeMenu();
        }
    }, { passive: true });
    
    // Close menu when clicking on nav links
    const navLinks = mobileNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        }, { passive: true });
    });
}

/**
 * Toggle animations based on menu state for better performance
 */
function toggleAnimations(isPaused) {
    const animatedElements = [DOM.categoriesScroll];
    
    animatedElements.forEach(element => {
        if (element) {
            element.style.animationPlayState = isPaused ? 'paused' : 'running';
        }
    });
}

/**
 * Optimized categories scroll with reduced GPU load
 */
function initCategoriesScroll() {
    if (!DOM.categoriesScroll) return;
    
    // Reduce animation complexity on lower-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        DOM.categoriesScroll.style.animationDuration = '30s'; // Slower animation
    }
}

/**
 * Optimized smooth scrolling with passive listeners
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, { passive: false });
    });
}

/**
 * Optimized testimonials with requestAnimationFrame
 */
function initTestimonials() {
    if (!DOM.testimonials.length) return;
    
    let currentTestimonial = 0;
    let animationId;

    function showTestimonial(index) {
        DOM.testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
        
        DOM.testimonialDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % DOM.testimonials.length;
        showTestimonial(currentTestimonial);
        
        // Use requestAnimationFrame for smoother transitions
        animationId = requestAnimationFrame(() => {
            setTimeout(nextTestimonial, 5000);
        });
    }
    
    // Set up dot click handlers
    DOM.testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
            
            // Reset timer
            cancelAnimationFrame(animationId);
            setTimeout(nextTestimonial, 5000);
        }, { passive: true });
    });
    
    // Start rotation
    setTimeout(nextTestimonial, 5000);
}

/**
 * Optimized purpose gallery with intersection observer
 */
function initPurposeGallery() {
    if (!DOM.gallerySlides.length) return;
    
    let currentSlide = 0;
    let isVisible = false;
    
    function showSlide(index) {
        DOM.gallerySlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        DOM.galleryDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    function nextSlide() {
        if (!isVisible) return; // Don't animate if not visible
        
        currentSlide = (currentSlide + 1) % DOM.gallerySlides.length;
        showSlide(currentSlide);
    }
    
    // Use Intersection Observer to control animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
        });
    }, { threshold: 0.5 });
    
    const galleryContainer = document.querySelector('.purpose-image-gallery');
    if (galleryContainer) {
        observer.observe(galleryContainer);
    }
    
    // Set up dot click handlers
    DOM.galleryDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            showSlide(currentSlide);
        }, { passive: true });
    });
    
    // Start slideshow
    setInterval(nextSlide, 4000);
}

/**
 * Optimized scroll animations with Intersection Observer
 */
function initScrollAnimations() {
    // Use Intersection Observer for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scrolled');
                // Unobserve to prevent repeated triggers
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    // Observe elements that need scroll animations
    const elementsToAnimate = document.querySelectorAll('h2, .feature, .purpose-text p');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Optimized heading fix function
 */
function fixAllHeadings() {
    // Use more specific selectors to avoid unnecessary processing
    const headings = document.querySelectorAll('h2:not(.fixed)');
    
    headings.forEach(heading => {
        // Remove any unwanted styles more efficiently
        if (heading.style.background) {
            heading.style.removeProperty('background');
            heading.style.removeProperty('background-color');
            heading.style.removeProperty('background-image');
        }
        
        // Mark as fixed to avoid reprocessing
        heading.classList.add('fixed');
    });
}

/**
 * Initialize language toggle
 */
function initLanguageToggle() {
    const langToggles = document.querySelectorAll('.language-toggle');
    
    langToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the selected language
            const lang = this.textContent.trim();
            
            // Check if we're not already on the page for this language
            if (!this.classList.contains('active')) {
                // Determine which page to navigate to based on current URL
                let currentPath = window.location.pathname;
                let currentPage = currentPath.split('/').pop();
                
                // If we're on any page other than index
                if (currentPage && !currentPage.includes('index')) {
                    // Just change language suffix
                    let baseName = currentPage.split('.')[0].replace(/-fr$/, '');
                    let targetPage = baseName + (lang === 'FR' ? '-fr' : '') + '.html';
                    window.location.href = targetPage;
                } else {
                    // Default index page behavior
                    let targetPage = 'index.html';
                    if (lang === 'FR') {
                        targetPage = 'index-fr.html';
                    }
                    window.location.href = targetPage;
                }
                
                // Save language preference in localStorage for future visits
                localStorage.setItem('preferred_language', lang);
            }
        });
    });
    
    // Check for saved language preference on page load
    document.addEventListener('DOMContentLoaded', function() {
        const savedLang = localStorage.getItem('preferred_language');
        
        // If there's a saved preference and we're not already on that language page
        if (savedLang) {
            const currentLang = document.documentElement.lang.toUpperCase();
            
            if (savedLang !== currentLang) {
                // Get current page
                let currentPath = window.location.pathname;
                let currentPage = currentPath.split('/').pop();
                
                // Determine target page based on current page
                let targetPage;
                if (currentPage && !currentPage.includes('index')) {
                    let baseName = currentPage.split('.')[0].replace(/-fr$/, '');
                    targetPage = baseName + (savedLang === 'FR' ? '-fr' : '') + '.html';
                } else {
                    targetPage = savedLang === 'FR' ? 'index-fr.html' : 'index.html';
                }
                
                // Small delay to prevent redirect loops
                setTimeout(() => {
                    window.location.href = targetPage;
                }, 100);
            }
        }
    });
}

/**
 * Handle form submission
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.newsletter-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(form);
            const formValues = {};
            
            for (const [key, value] of formData.entries()) {
                formValues[key] = value;
            }
            
            // You would normally send this data to a server
            console.log('Form submitted:', formValues);
            
            // Show success message in the appropriate language
            const lang = document.documentElement.lang.toLowerCase();
            let successTitle, successMessage;
            
            if (lang === 'fr') {
                successTitle = "Merci de vous être inscrit !";
                successMessage = "Votre burger d'anniversaire gratuit vous attend. Nous vous contacterons bientôt.";
            } else {
                successTitle = "Thank you for subscribing!";
                successMessage = "Your free birthday burger is waiting. We'll be in touch soon.";
            }
            
            form.innerHTML = `<div class="success-message"><h3>${successTitle}</h3><p>${successMessage}</p></div>`;
        });
    }
}); 