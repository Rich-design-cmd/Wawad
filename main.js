// Main JavaScript file for common functionality

// Initialize all pages
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
    
    // Highlight current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('bg-gray-700', 'text-white');
            link.classList.remove('text-gray-300', 'hover:bg-gray-700', 'hover:text-white');
        }
    });
    
    // Initialize any video backgrounds
    const videoBackgrounds = document.querySelectorAll('.video-background iframe');
    videoBackgrounds.forEach(iframe => {
        iframe.style.pointerEvents = 'none'; // Make video non-interactive
    });
    
    // Newsletter form handler (common to all pages)
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            const messageDiv = document.getElementById('newsletter-message');
            
            if (!emailInput || !messageDiv) return;
            
            const email = emailInput.value;
            
            // Simple email validation
            if (!email.includes('@') || !email.includes('.')) {
                messageDiv.innerHTML = `
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        Please enter a valid email address.
                    </div>
                `;
                return;
            }
            
            // Show loading state
            messageDiv.innerHTML = `
                <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded flex items-center">
                    <i class="fas fa-spinner fa-spin mr-2"></i>
                    Subscribing...
                </div>
            `;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                messageDiv.innerHTML = `
                    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        <i class="fas fa-check-circle mr-2"></i>
                        Thank you for subscribing to our newsletter!
                    </div>
                `;
                
                emailInput.value = '';
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    messageDiv.innerHTML = '';
                }, 5000);
                
            } catch (error) {
                messageDiv.innerHTML = `
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <i class="fas fa-exclamation-circle mr-2"></i>
                        Sorry, something went wrong. Please try again.
                    </div>
                `;
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
    
    // Add active class to navigation items on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('bg-gray-700', 'text-white');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('bg-gray-700', 'text-white');
            }
        });
    });
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Add animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.article-card, .story-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate-fade-in');
            }
        });
    };
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.6s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
    
    // Initial animation check
    animateOnScroll();
    
    // Check animations on scroll
    window.addEventListener('scroll', animateOnScroll);
});

// Utility functions
export function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

export function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});