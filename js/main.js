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
    const categoryItems = document.querySelectorAll('.category-item');
    const animateElements = document.querySelectorAll('.feature, .menu-category, h2:not(.purpose-text h2)');
    
    // Apply animations to purpose section elements
    if (purposeHeader) {
        purposeHeader.classList.add('purpose-header-animation');
        // Check if already in viewport on page load
        if (isInViewport(purposeHeader)) {
            purposeHeader.classList.add('scrolled');
        }
    }
    
    if (purposeParagraphs.length > 0) {
        purposeParagraphs.forEach((paragraph, index) => {
            paragraph.classList.add('purpose-paragraph-animation');
            // Add additional delay for paragraphs after the first one
            if (index >= 1) {
                paragraph.style.animationDelay = `${0.3 + index * 0.2}s`;
            }
            
            // Check if already in viewport on page load
            if (isInViewport(paragraph)) {
                paragraph.classList.add('scrolled');
            }
        });
    }
    
    // Apply animations to category items
    if (categoryItems.length > 0) {
        categoryItems.forEach((item, index) => {
            // Only apply to the first 6 items (not the duplicates)
            if (index < 6) {
                item.classList.add('category-item-animation');
                item.style.animationDelay = `${0.1 + index * 0.1}s`;
                
                // Check if already in viewport on page load
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
        
        // Check category items
        if (categoryItems.length > 0) {
            categoryItems.forEach((item, index) => {
                if (index < 6 && !item.classList.contains('scrolled') && isInViewport(item)) {
                    item.classList.add('scrolled');
                }
            });
        }
        
        // Check other animated elements
        animateElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('scrolled');
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
                // Determine which page to navigate to
                let targetPage = 'index.html';
                if (lang === 'FR') {
                    targetPage = 'index-fr.html';
                }
                
                // Save language preference in localStorage for future visits
                localStorage.setItem('preferred_language', lang);
                
                // Redirect to the appropriate language version
                window.location.href = targetPage;
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
                // Redirect to the preferred language version if it doesn't match current
                let targetPage = 'index.html';
                if (savedLang === 'FR') {
                    targetPage = 'index-fr.html';
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