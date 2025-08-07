document.addEventListener('DOMContentLoaded', () => {

    // A reusable throttle function
    function throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      }
    }

    // --- Sticky Header Logic ---
    const header = document.querySelector('.main-header');
    if (header) {
        // The function that handles the scroll logic
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        // Add the event listener with the throttled function
        // This will run the handleScroll function at most once every 200ms
        window.addEventListener('scroll', throttle(handleScroll, 200));
    }

    // --- Mobile Menu Logic ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // --- Reusable On-Scroll Animation Logic ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Optional: Stop observing after animation
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Lightbox Gallery Logic ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxCloseBtn = lightbox.querySelector('.lightbox-close');

        const openLightbox = (imgSrc) => {
            lightboxImage.src = imgSrc;
            lightbox.classList.add('active');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
        };

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img').src;
                openLightbox(imgSrc);
            });
        });

        lightboxCloseBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
        });
    }

    // =================================== //
// === NEW SCRIPT FOR V2 LANDING PAGE === //
// =================================== //

// --- Animated Counter Logic ---
const statsSection = document.querySelector(".stats-section");
const statNumbers = document.querySelectorAll(".stat-number");

const startCounter = (entry) => {
    if (entry.isIntersecting) {
        statNumbers.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const speed = 200; // Lower number is faster

            const updateCount = () => {
                const increment = target / speed;
                count += increment;

                if (count < target) {
                    counter.innerText = Math.ceil(count);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
        // Stop observing once the animation has started
        statObserver.unobserve(statsSection);
    }
};

const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        startCounter(entry);
    });
}, {
    threshold: 0.5
});

// Only run the counter if the stats section exists on the page
if (statsSection) {
    statObserver.observe(statsSection);
}

// --- Automatic Copyright Year ---
const copyrightYear = document.getElementById('copyright-year');
if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
}

// 1. Get the form and the message container
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

// 2. Add an event listener for the 'submit' event
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // 3. Prevent the default form submission (the page reload)
        e.preventDefault();

        // 4. Gather the form data
        const formData = new FormData(contactForm);
        
        // Optional: Show a "sending..." message
        formMessage.textContent = 'Sending...';
        formMessage.style.color = '#374151';

        // 5. Use the fetch API to send the data
        fetch('https://formspree.io/f/xkgzvagr', { // <-- 1. USE YOUR FORMSPREE URL HERE
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json' // <-- 2. ADD THIS HEADER
            }
        })
        .then(response => {
            if (response.ok) {
                // 6a. Handle a successful response
                formMessage.textContent = 'Thank you! Your message has been sent successfully.';
                formMessage.style.color = 'green';
                formMessage.style.display = 'block';
                contactForm.reset(); // Clear the form fields
            } else {
                // 6b. Handle an error response from the server
                formMessage.textContent = 'Oops! Something went wrong. Please try again later.';
                formMessage.style.color = 'red';
                formMessage.style.display = 'block';
            }
        })
        .catch(error => {
            // 7. Handle a network error (e.g., user is offline)
            console.error('Error:', error);
            formMessage.textContent = 'A network error occurred. Please check your connection and try again.';
            formMessage.style.color = 'red';
            formMessage.style.display = 'block';
        });
    });
}

});