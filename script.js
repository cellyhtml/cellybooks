document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');

    // Initial hide until mouse move
    cursorDot.style.opacity = 0;
    cursorCircle.style.opacity = 0;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursorDot.style.opacity = 1;
        cursorCircle.style.opacity = 1;

        // Dot follows instantly
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Smooth follow for circle
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * 0.1;
        cursorY += dy * 0.1;

        cursorCircle.style.left = cursorX + 'px';
        cursorCircle.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor Interactions
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursorCircle.style.transform = 'translate(-50%, -50%) scale(2)';
            cursorCircle.style.backgroundColor = 'rgba(200, 155, 106, 0.2)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
        });
        link.addEventListener('mouseleave', () => {
            cursorCircle.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorCircle.style.backgroundColor = 'transparent';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // --- Intersection Observer (Scroll Reveal) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-text, .reveal-up');
    revealElements.forEach(el => observer.observe(el));


    // --- Navigation Color Toggle ---
    const nav = document.querySelector('.fixed-nav');
    const lightSections = document.querySelectorAll('.journal-section, .about-section, .post-container');
    // Sections with BEIGE background need INVERTED (Brown) nav.
    // Default nav is BEIGE (for Brown backgrounds).

    const navObserverOptions = {
        root: null,
        threshold: 0,
        rootMargin: "-50px 0px -90% 0px" // Trigger when section hits the top
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                nav.classList.add('inverted');
            } else {
                // Must check if we are NOT intersecting ANY light section
                // But simplified: this logic might flick. preferred way requires tracking.
                // Better approach: Observer all sections and apply class based on active.
            }
        });
    }, navObserverOptions);

    // Better logic: Observe all sections
    const allSections = document.querySelectorAll('section, main');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If the section is "light" (Beige bg), make nav Dark (Inverted)
                if (entry.target.classList.contains('journal-section') ||
                    entry.target.classList.contains('about-section') ||
                    entry.target.querySelector('.article-content')) { // simplistic check for post page
                    nav.classList.add('inverted');
                } else {
                    nav.classList.remove('inverted');
                }
            }
        });
    }, { rootMargin: "-10% 0px -85% 0px", threshold: 0 }); // Active area near top

    allSections.forEach(s => sectionObserver.observe(s));

    // Also observe the 'post-container' specifically for post pages
    const postContainer = document.querySelector('.post-container');
    if (postContainer) {
        // Post pages usually start with a large header (Brown BG usually?) 
        // Wait, post-header is brown bg? No, post-header is inside main.
        // Let's check style.css: body is brown. post-header is transparent?
        // Actually post-livros-velhos.html body is .is-loading but style.css says body bg is brown.
        // article-content is likely beige text on brown bg?
        // Let's re-read style.css...
        // .article-content { color: var(--c-beige); } -> So bg is Brown.
        // So on post pages, nav should be default (Beige).
        // Only on Journal and About (Beige BG) should nav be Inverted (Brown).

        // So the logic above is:
        // Journal (Beige BG) -> Inverted Nav (Brown Text)
        // About (Beige BG) -> Inverted Nav (Brown Text)
        // Others (Brown BG) -> Default Nav (Beige Text)
    }

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        // Parallax for visual gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            const speed = item.getAttribute('data-speed') || 1;
            const yPos = -(scrolled * speed * 0.1);
            // Only apply if visible to save performance? 
            // For simplicity in this scope, just apply
            // item.style.transform = `translateY(${yPos}px)`; 
            // *Correction*: Simple transform on scroll can be jittery without requestAnimationFrame
            // Skipping complex parallax in JS for performance fidelity in this setup
        });
    });

    // Remove loading class
    document.body.classList.remove('is-loading');

    // --- Mobile Menu Logic ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            
            if (isActive) {
                menuToggle.textContent = 'Fechar';
                document.body.style.overflow = 'hidden'; // Lock scroll
            } else {
                menuToggle.textContent = 'Menu';
                document.body.style.overflow = ''; // Unlock scroll
            }
        });

        // Close menu when link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.textContent = 'Menu';
                document.body.style.overflow = '';
            });
        });
    }

});
