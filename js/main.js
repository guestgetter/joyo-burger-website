/**
 * JOYO Burger Website - Main JavaScript
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initSmoothScrolling();
    initCategoriesScroll();
    initTestimonials();
    initScrollAnimations();
    initLanguageToggle();
    initPurposeGallery();
    
    // Fix all h2 headings to prevent unwanted background styles
    fixAllHeadings();
    
    // Run again after a short delay to catch any dynamically added elements
    setTimeout(fixAllHeadings, 300);
    setTimeout(fixAllHeadings, 1000);
});

/**
 * Initialize the categories scrolling effect
 */
function initCategoriesScroll() {
    const categoriesContainer = document.querySelector('.categories-container');
    
    if (categoriesContainer) {
        const categoriesScroll = categoriesContainer.querySelector('.categories-scroll');
        
        // Ensure continuous looping by checking when animation completes
        categoriesScroll.addEventListener('animationiteration', () => {
            // Reset position instantly if needed for smoother transition
            console.log('Animation loop completed');
        });
        
        // Make category items more interactive without affecting the scroll
        const categoryItems = categoriesContainer.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                // Only adjust visual properties, don't change the scroll
                this.style.zIndex = '10';
            });
            
            item.addEventListener('mouseleave', function() {
                // Reset after hover
                setTimeout(() => {
                    this.style.zIndex = '';
                }, 300);
            });
        });
    }
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const header = document.querySelector('header');
    
    // Create mobile nav if it doesn't exist
    if (!document.querySelector('.mobile-nav')) {
        const mainNav = document.querySelector('.main-nav');
        const ctaButtons = document.querySelector('.cta-buttons');
        
        if (mainNav && ctaButtons) {
            const mobileNav = document.createElement('div');
            mobileNav.className = 'mobile-nav';
            
            // Clone navigation list
            const navList = mainNav.querySelector('.nav-list').cloneNode(true);
            
            // Remove blog link if it exists
            const blogLink = navList.querySelector('a[href="#blog"]');
            if (blogLink && blogLink.parentElement) {
                blogLink.parentElement.remove();
            }
            
            mobileNav.appendChild(navList);
            
            // Clone language selector and social icons
            const langSelector = ctaButtons.querySelector('.language-selector');
            const socialIcons = ctaButtons.querySelector('.social-icons');
            const orderButton = ctaButtons.querySelector('.order-now-btn');
            
            if (orderButton) {
                const orderButtonClone = orderButton.cloneNode(true);
                mobileNav.appendChild(orderButtonClone);
            }
            
            if (langSelector) {
                const langSelectorClone = langSelector.cloneNode(true);
                mobileNav.appendChild(langSelectorClone);
            }
            
            if (socialIcons) {
                const socialIconsClone = socialIcons.cloneNode(true);
                mobileNav.appendChild(socialIconsClone);
            }
            
            document.body.appendChild(mobileNav);
        }
    }
    
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('mobile-menu-active');
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('mobile-menu-active');
                mobileNav.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize testimonials slider
 */
function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentTestimonial = 0;
    let testimonialInterval;

    // Function to show a specific testimonial
    function showTestimonial(index) {
        // Remove active class from all testimonials and dots
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current testimonial and dot
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentTestimonial = index;
    }

    // Function to show the next testimonial
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }

    // Start automatic testimonial rotation
    function startRotation() {
        testimonialInterval = setInterval(nextTestimonial, 8000);
    }

    // Stop automatic testimonial rotation
    function stopRotation() {
        clearInterval(testimonialInterval);
    }

    // Add click events to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopRotation();
            showTestimonial(index);
            startRotation();
        });
    });

    // Initialize testimonial rotation
    if (testimonials.length > 0) {
        showTestimonial(0);
        startRotation();
    }
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    // Function to check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Elements to animate
    const purposeHeader = document.querySelector('.purpose-text h2');
    const purposeParagraphs = document.querySelectorAll('.purpose-text p');
    const showcaseCategories = document.querySelectorAll('.categories-showcase .category-item');
    const animateElements = document.querySelectorAll('.feature, .menu-category, h2:not(.purpose-text h2)');
    
    // Apply animations to purpose section elements
    if (purposeHeader) {
        purposeHeader.classList.add('purpose-header-animation');
        if (isInViewport(purposeHeader)) {
            purposeHeader.classList.add('scrolled');
        }
    }
    
    if (purposeParagraphs.length > 0) {
        purposeParagraphs.forEach((paragraph, index) => {
            paragraph.classList.add('purpose-paragraph-animation');
            if (index >= 1) {
                paragraph.style.animationDelay = `${0.3 + index * 0.2}s`;
            }
            if (isInViewport(paragraph)) {
                paragraph.classList.add('scrolled');
            }
        });
    }
    
    // Apply animations to showcase category items only
    if (showcaseCategories.length > 0) {
        showcaseCategories.forEach((item, index) => {
            // Only apply to the first 6 items (not the duplicates)
            if (index < 6) {
                item.classList.add('category-item-animation');
                item.style.animationDelay = `${0.1 + index * 0.1}s`;
                if (isInViewport(item)) {
                    item.classList.add('scrolled');
                }
            }
        });
    }
    
    // Add scroll class to elements in viewport on page load
    animateElements.forEach(element => {
        if (isInViewport(element)) {
            element.classList.add('scrolled');
            
            // Ensure no unwanted background styles on h2 elements
            if (element.tagName.toLowerCase() === 'h2') {
                // Explicitly remove any problematic styles
                element.style.background = 'none';
                element.style.backgroundColor = 'transparent';
                element.style.textShadow = 'none';
            }
        }
    });
    
    // Add scroll event listener to trigger animations when scrolling
    window.addEventListener('scroll', () => {
        // Check purpose header
        if (purposeHeader && !purposeHeader.classList.contains('scrolled') && isInViewport(purposeHeader)) {
            purposeHeader.classList.add('scrolled');
        }
        
        // Check purpose paragraphs
        if (purposeParagraphs.length > 0) {
            purposeParagraphs.forEach(paragraph => {
                if (!paragraph.classList.contains('scrolled') && isInViewport(paragraph)) {
                    paragraph.classList.add('scrolled');
                }
            });
        }
        
        // Check showcase category items
        if (showcaseCategories.length > 0) {
            showcaseCategories.forEach((item, index) => {
                if (index < 6 && !item.classList.contains('scrolled') && isInViewport(item)) {
                    item.classList.add('scrolled');
                }
            });
        }
        
        // Check other animated elements
        animateElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('scrolled');
                
                // Ensure no unwanted background styles on h2 elements
                if (element.tagName.toLowerCase() === 'h2') {
                    // Explicitly remove any problematic styles
                    element.style.background = 'none';
                    element.style.backgroundColor = 'transparent';
                    element.style.textShadow = 'none';
                    
                    // Apply proper color based on parent section
                    const parentSection = element.closest('section');
                    if (parentSection) {
                        if (parentSection.classList.contains('features-section') || 
                            parentSection.classList.contains('categories-showcase') ||
                            parentSection.classList.contains('cta-section') ||
                            parentSection.classList.contains('bg-dark')) {
                            element.style.color = 'white';
                        } else {
                            element.style.color = '#000000';
                        }
                    }
                }
            }
        });
        
        // Handle header background
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Function to ensure no h2 elements have unwanted backgrounds
    function fixAllHeadings() {
        const allHeadings = document.querySelectorAll('h2');
        allHeadings.forEach(heading => {
            // Remove any problematic background or color styles
            heading.style.background = 'none';
            
            // Check if the heading is in the Locations page
            const isLocationsPage = document.body.classList.contains('locations-page');
            
            // Skip color determination for locations page - CSS will handle it
            if (isLocationsPage) {
                // For locations page, only remove background
                return;
            }
            
            // For other pages, continue with brightness detection
            const parentSection = heading.closest('section');
            if (parentSection) {
                const computedStyle = getComputedStyle(parentSection);
                const bgColor = computedStyle.backgroundColor;
                
                // Convert bgcolor to RGB values for analysis
                const rgb = bgColor.match(/\d+/g);
                
                if (rgb && rgb.length >= 3) {
                    // Calculate brightness (rough estimate)
                    const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                    
                    if (brightness < 128) {
                        // Dark background - set light text
                        heading.style.color = 'white';
                    } else {
                        // Light background - set dark text
                        heading.style.color = 'black';
                    }
                } else {
                    // Default to white if can't determine background
                    heading.style.color = 'white';
                }
            }
        });
    }
    
    // Run on page load and after slight delay to catch any dynamic changes
    fixAllHeadings();
    setTimeout(fixAllHeadings, 500);
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

/**
 * Initialize the purpose section image gallery with simple fade transition
 */
function initPurposeGallery() {
    // Support both HTML structures (index.html uses gallery-slide, index-fr.html uses carousel-slide)
    const slides = document.querySelectorAll('.gallery-slide, .carousel-slide');
    const dots = document.querySelectorAll('.gallery-dot, .carousel-dots .dot');
    
    if (slides.length === 0 || dots.length === 0) return; // Exit if no slides found
    
    let currentSlide = 0;
    let galleryInterval;
    let isTransitioning = false;

    // Function to show a specific slide with fade transition
    function showSlide(index) {
        if (currentSlide === index || isTransitioning) return;
        isTransitioning = true;
        
        // Remove active class from current slide and dot
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        // Add active class to new slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Update current slide
        currentSlide = index;
        
        // Reset transition lock after animation completes
        setTimeout(() => {
            isTransitioning = false;
        }, 500); // Match this to the CSS transition duration
    }

    // Function to show the next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    // Start automatic slide rotation
    function startRotation() {
        stopRotation(); // Clear any existing interval
        galleryInterval = setInterval(nextSlide, 4000); // 4 second interval
    }

    // Stop automatic slide rotation
    function stopRotation() {
        clearInterval(galleryInterval);
    }

    // Add click events to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopRotation();
            startRotation();
        });
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        const gallery = document.querySelector('.purpose-image-gallery, .purpose-carousel');
        // Only respond to keyboard if gallery is in viewport
        if (gallery && isElementInViewport(gallery)) {
            if (e.key === 'ArrowLeft') {
                const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(prevIndex);
                stopRotation();
                startRotation();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                stopRotation();
                startRotation();
            }
        }
    });

    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Initialize gallery if slides exist
    if (slides.length > 0) {
        // Make sure first slide is active
        slides[0].classList.add('active');
        dots[0].classList.add('active');
        
        // Start rotation
        startRotation();
    }
} 