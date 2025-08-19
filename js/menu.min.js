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

    // Check if we have a hash in the URL (anchor navigation)
    const urlHash = window.location.hash.substring(1); // Remove the # symbol
    let targetSection = null;
    
    if (urlHash) {
        targetSection = document.getElementById(urlHash);
    }

    // Hide all menu sections except the active one on initial load
    const menuSections = document.querySelectorAll('.menu-section');
    menuSections.forEach(section => {
        if (targetSection && section.id === urlHash) {
            // If we have a target section from URL hash, make it active
            section.classList.add('active');
            section.style.display = 'block';
            section.classList.add('no-load-animation');
            
            // Update the sidebar to reflect the correct active category
            const menuCategories = document.querySelectorAll('.menu-category');
            menuCategories.forEach(category => {
                category.classList.remove('active');
                if (category.getAttribute('data-category') === urlHash) {
                    category.classList.add('active');
                }
            });
        } else if (!targetSection && section.classList.contains('active')) {
            // Default behavior - show the initially active section
            section.style.display = 'block';
            section.classList.add('no-load-animation');
        } else {
            // Hide all other sections
            section.style.display = 'none';
            section.classList.remove('active');
        }
    });

    // Initialize menu-specific functionality
    initMenuNavigation();
    setupKeyboardNavigation();
    
    // Set up menu items with translation if available
    setupMenuTranslations();
    
    // Scroll to target section if we have one
    if (targetSection) {
        setTimeout(() => {
            scrollToSection(targetSection);
        }, 100); // Small delay to ensure everything is rendered
    }
});

/**
 * Scroll to a specific menu section
 */
function scrollToSection(targetSection) {
    if (!targetSection) return;
    
    // Scroll the target section into view
    const siteHeader = document.querySelector('.site-header');
    const siteHeaderHeight = siteHeader ? siteHeader.offsetHeight : 0;
    let effectiveViewportOffset;

    if (window.innerWidth < 992) {
        // Mobile: target position is below fixed header + sticky category bar.
        const mobileCategoryBarGap = 60;
        effectiveViewportOffset = siteHeaderHeight + mobileCategoryBarGap + 10;
    } else {
        // Desktop: target position aligns with where the sticky sidebar visually starts.
        const desktopSidebarGap = 100;
        effectiveViewportOffset = desktopSidebarGap + 10;
    }

    const sectionAbsoluteTop = targetSection.getBoundingClientRect().top + window.pageYOffset;
    const scrollToPosition = sectionAbsoluteTop - effectiveViewportOffset;

    window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth'
    });
}

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
            // Remove no-load-animation from all sections once user interacts
            menuSections.forEach(sec => sec.classList.remove('no-load-animation'));

            // Get target category
            const targetCategory = this.getAttribute('data-category');
            
            // Update active states
            menuCategories.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            // Hide all sections first
            menuSections.forEach(section => {
                section.classList.remove('active');
                section.style.display = 'none'; // Explicitly hide all sections
            });
            
            // Show ONLY the corresponding section and scroll it into view
            const targetSection = document.getElementById(targetCategory);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.style.display = 'block'; // Explicitly show only the target section
                
                // Use the centralized scroll function
                scrollToSection(targetSection);
            }
        });
    });
    
    // Handle scroll based activation for mobile category bar highlighting
    if (window.innerWidth < 992) {
        window.addEventListener('scroll', debounce(function() {
            const scrollPosition = window.pageYOffset + (document.querySelector('.site-header')?.offsetHeight || 0) + 70; // Offset by header + category bar height + small buffer
            
            let activeSectionId = null;
            menuSections.forEach(section => {
                if (section.classList.contains('active')) { // Only consider the currently displayed broad category
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                         // Check actual sub-sections or headers within the active section if any
                        const subHeaders = section.querySelectorAll('.section-header');
                        let currentSubSectionVisible = section.id; // Default to main section id

                        if (subHeaders.length > 1) { // If multiple actual h2/sub-sections exist
                            subHeaders.forEach(sh => {
                                if (sh.getBoundingClientRect().top < ((document.querySelector('.site-header')?.offsetHeight || 0) + 70) ) {
                                    currentSubSectionVisible = sh.closest('.menu-section')?.id || section.id;
                                }
                            });
                        } else {
                           // If the main section itself is what matters for category highlighting
                           if (section.getBoundingClientRect().top < ((document.querySelector('.site-header')?.offsetHeight || 0) + 70)) {
                                currentSubSectionVisible = section.id;
                           }
                        }
                        activeSectionId = currentSubSectionVisible;
                    }
                }
            });

            if (activeSectionId) {
                menuCategories.forEach(item => {
                    if (item.getAttribute('data-category') === activeSectionId) {
                        if (!item.classList.contains('active')) {
                            menuCategories.forEach(cat => cat.classList.remove('active'));
                            item.classList.add('active');
                            
                            const categoriesContainer = document.querySelector('.menu-categories ul');
                            if (categoriesContainer) {
                                const itemLeft = item.offsetLeft;
                                categoriesContainer.scrollTo({
                                    left: itemLeft - 20, // Small offset to not hide part of the item
                                    behavior: 'smooth'
                                });
                            }
                        }
                    }
                });
            }
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

// Function to ensure the initial active section is visible on load - REMOVED AGAIN
/*
function ensureInitialSectionIsVisible() {
    const activeSection = document.querySelector('.menu-section.active');
    if (!activeSection) return;

    const siteHeader = document.querySelector('.site-header');
    const siteHeaderHeight = siteHeader ? siteHeader.offsetHeight : 0;
    
    let targetSectionTopInViewport;

    if (window.innerWidth < 992) { // Mobile
        const mobileCategoryBar = document.querySelector('.menu-sidebar');
        let mobileCategoryBarGap = 60; // Default from CSS for .menu-sidebar top on mobile
        if (mobileCategoryBar) {
            const topStyle = getComputedStyle(mobileCategoryBar).top;
            if (topStyle && topStyle !== 'auto') {
                const parsedTop = parseInt(topStyle, 10);
                if (!isNaN(parsedTop)) {
                    mobileCategoryBarGap = parsedTop;
                }
            }
        }
        targetSectionTopInViewport = siteHeaderHeight + mobileCategoryBarGap + 10; // +10px margin
    } else { // Desktop
        const desktopSidebar = document.querySelector('.menu-sidebar');
        let desktopSidebarGap = 100; // Default from CSS for .menu-sidebar top on desktop
         if (desktopSidebar) {
            const topStyle = getComputedStyle(desktopSidebar).top;
            if (topStyle && topStyle !== 'auto') {
                const parsedTop = parseInt(topStyle, 10);
                if (!isNaN(parsedTop)) {
                    desktopSidebarGap = parsedTop;
                }
            }
        }
        targetSectionTopInViewport = desktopSidebarGap + 10; // +10px margin
    }

    const sectionCurrentAbsoluteTop = activeSection.getBoundingClientRect().top + window.pageYOffset;
    const targetScrollPosition = sectionCurrentAbsoluteTop - targetSectionTopInViewport;
    
    // Only scroll if the calculated position is valid (>=0)
    // and if the section is not already very close to the target position.
    if (targetScrollPosition >= 0 && Math.abs(window.pageYOffset - targetScrollPosition) > 1) {
        window.scrollTo({
            top: targetScrollPosition,
            behavior: 'auto' // 'auto' for instant adjustment on load
        });
    }
}
*/ 