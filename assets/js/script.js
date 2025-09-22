// Oasis Fit — Optimized JavaScript with Performance Enhancements
(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        carouselInterval: 5000,
        animationOffset: 100,
        scrollThreshold: 50,
        formTimeout: 2000
    };
    
    // DOM Ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });
    
    function initializeApp() {
        // Initialize components in order of priority
        initializeLoader();
        initializeNavigation();
        initializeForms();
        initializeCarousels();
        initializeAnimations();
        initializeAccessibility();
        
        // Performance optimizations
        optimizeImages();
        setupIntersectionObserver();
    }
    
    // Loader Management
    function initializeLoader() {
        const loader = document.getElementById('pageLoader');
        
        if (loader) {
            // Hide loader when page is fully loaded
            if (document.readyState === 'complete') {
                hideLoader(loader);
            } else {
                window.addEventListener('load', () => hideLoader(loader));
            }
            
            // Fallback: hide loader after 3 seconds max
            setTimeout(() => hideLoader(loader), 3000);
        }
    }
    
    function hideLoader(loader) {
        if (!loader) return;
        
        loader.classList.add('hidden');
        setTimeout(() => {
            if (loader.parentNode) {
                loader.style.display = 'none';
            }
        }, 500);
    }
    
    // Navigation
    function initializeNavigation() {
        // Scroll effect
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    handleScroll();
                    scrollTimeout = null;
                }, 10);
            }
        });
        
        // Mobile menu accessibility
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarToggler) {
            navbarToggler.addEventListener('click', function() {
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !expanded);
            });
        }
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    smoothScrollTo(href);
                }
            });
        });
    }
    
    function handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const scrolled = window.scrollY > CONFIG.scrollThreshold;
            navbar.classList.toggle('scrolled', scrolled);
        }
        
        // Lazy load images when they come into view
        checkLazyImages();
    }
    
    // Forms
    function initializeForms() {
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            setupBookingForm(bookingForm);
        }
        
        // Add loading states to all forms
        document.querySelectorAll('form').forEach(form => {
            if (!form.id) return;
            
            form.addEventListener('submit', function(e) {
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    handleFormSubmit(this, submitBtn, e);
                }
            });
        });
    }
    
    function setupBookingForm(form) {
        // Set minimum date to today
        const dateInput = form.querySelector('#date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
            dateInput.value = today;
        }
        
        // Real-time validation
        form.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
    
    function handleFormSubmit(form, submitBtn, event) {
        event.preventDefault();
        
        const originalText = submitBtn.textContent;
        const msgContainer = form.querySelector('#formMsg') || createMessageContainer(form);
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        submitBtn.classList.add('disabled');
        
        msgContainer.className = 'alert alert-info';
        msgContainer.textContent = 'Processing your request...';
        msgContainer.style.display = 'block';
        
        // Simulate API call
        setTimeout(() => {
            const success = Math.random() > 0.1; // 90% success rate for demo
            
            if (success) {
                showFormSuccess(form, msgContainer, submitBtn, originalText);
            } else {
                showFormError(msgContainer, submitBtn, originalText);
            }
        }, CONFIG.formTimeout);
    }
    
    function showFormSuccess(form, msgContainer, submitBtn, originalText) {
        msgContainer.className = 'alert alert-success';
        msgContainer.innerHTML = `
            <strong>Success!</strong> Your request has been received. 
            We'll contact you within 24 hours to confirm.
        `;
        
        // Reset form and button
        setTimeout(() => {
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('disabled');
        }, 1000);
        
        // Hide message after 5 seconds
        setTimeout(() => {
            msgContainer.style.display = 'none';
        }, 5000);
    }
    
    function showFormError(msgContainer, submitBtn, originalText) {
        msgContainer.className = 'alert alert-danger';
        msgContainer.innerHTML = `
            <strong>Error!</strong> Please try again or contact us directly.
        `;
        
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('disabled');
    }
    
    function createMessageContainer(form) {
        const msg = document.createElement('div');
        msg.id = 'formMsg';
        msg.setAttribute('role', 'status');
        msg.setAttribute('aria-live', 'polite');
        form.appendChild(msg);
        return msg;
    }
    
    function validateField(field) {
        if (field.hasAttribute('required') && !field.value.trim()) {
            field.classList.add('is-invalid');
            return false;
        }
        
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                field.classList.add('is-invalid');
                return false;
            }
        }
        
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        return true;
    }
    
    // Carousels
    function initializeCarousels() {
        const carousel = document.getElementById('facilityCarousel');
        if (carousel && typeof bootstrap !== 'undefined') {
            const carouselInstance = new bootstrap.Carousel(carousel, {
                interval: CONFIG.carouselInterval,
                wrap: true,
                pause: 'hover',
                touch: true
            });
            
            // Pause carousel when user interacts with it
            carousel.addEventListener('mouseenter', () => carouselInstance.pause());
            carousel.addEventListener('mouseleave', () => carouselInstance.cycle());
        }
    }
    
    // Animations
    function initializeAnimations() {
        // Initialize AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                mirror: false,
                offset: 100
            });
        }
        
        // Add pulse animation to CTA buttons
        document.querySelectorAll('.btn-success').forEach(btn => {
            btn.classList.add('btn-pulse');
        });
        
        // Custom scroll animations
        setupScrollAnimations();
    }
    
    function setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            animatedElements.forEach(el => observer.observe(el));
        } else {
            // Fallback for older browsers
            animatedElements.forEach(el => el.classList.add('visible'));
        }
    }
    
    // Accessibility
    function initializeAccessibility() {
        // Add skip to content link
        addSkipLink();
        
        // Improve focus management
        document.addEventListener('keydown', handleKeyboardNavigation);
        
        // Add aria-labels to decorative images
        document.querySelectorAll('img[alt=""]').forEach(img => {
            img.setAttribute('aria-hidden', 'true');
        });
    }
    
    function addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--deep-blue);
            color: white;
            padding: 8px;
            z-index: 10000;
            text-decoration: none;
            border-radius: 4px;
        `;
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    function handleKeyboardNavigation(e) {
        // Tab key management
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    }
    
    // Performance Optimizations
    function optimizeImages() {
        // Lazy load images
        if ('loading' in HTMLImageElement.prototype) {
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                img.src = img.getAttribute('data-src') || img.src;
            });
        }
    }
    
    function checkLazyImages() {
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight + 100) {
                img.loading = 'eager';
            }
        });
    }
    
    function setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src') || img.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                observer.observe(img);
            });
        }
    }
    
    // Utility Functions
    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    // Error Handling
    window.addEventListener('error', function(e) {
        console.warn('Error occurred:', e.error);
    });
    
    // Performance Monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }
    
})();

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {};
}