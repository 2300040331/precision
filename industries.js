document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. SCROLL SPY FOR STICKY SIDEBAR
    // ==========================================
    const sections = document.querySelectorAll('.ind-section');
    const navLinks = document.querySelectorAll('.ind-nav-link');
    
    if (sections.length > 0 && navLinks.length > 0) {
        // Offset for the fixed global navbar
        const offset = 180; 

        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= (sectionTop - offset)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-target') === current) {
                    link.classList.add('active');
                }
            });
        }, { passive: true });
        
        // Smooth scroll for sidebar links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-target');
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 120, // offset for fixed header
                        behavior: 'smooth'
                    });
                }
            });
        });
    }


    // ==========================================
    // 2. GSAP SCROLL REVEAL ANIMATIONS
    // ==========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Animations (Immediate)
        const tlHero = gsap.timeline();
        tlHero.from(".ind-breadcrumbs", { y: 20, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2 })
              .from(".ind-hero-title", { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.7")
              .from(".ind-hero-divider", { width: 0, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.6")
              .from(".ind-hero-subtitle", { y: 20, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.7");
              
        // Parallax Hero BG
        gsap.to(".ind-hero-bg", {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: ".ind-hero-wrapper",
                start: "top top",
                end: "bottom top",
                scrub: true
            } 
        });

        // Intro Split Animations
        gsap.from(".ind-intro-left", {
            scrollTrigger: { trigger: ".ind-intro", start: "top 80%" },
            x: -50, opacity: 0, duration: 1, ease: "power3.out"
        });
        
        gsap.from(".ind-intro-divider", {
            scrollTrigger: { trigger: ".ind-intro", start: "top 80%" },
            scaleY: 0, transformOrigin: "top center", duration: 1, ease: "power3.out", delay: 0.3
        });

        gsap.from(".ind-intro-right", {
            scrollTrigger: { trigger: ".ind-intro", start: "top 80%" },
            x: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.5
        });

        // Industry Blocks Reveals
        const industryBlocks = document.querySelectorAll('.ind-floating-block');
        industryBlocks.forEach(block => {
            
            // Container slide up
            gsap.from(block, {
                scrollTrigger: {
                    trigger: block,
                    start: "top 85%"
                },
                y: 60,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
            
            // Image reveal inside block
            const imgCol = block.querySelector('.ind-col-img img');
            if (imgCol) {
                gsap.from(imgCol, {
                    scrollTrigger: {
                        trigger: block,
                        start: "top 85%"
                    },
                    scale: 1.2,
                    duration: 1.5,
                    ease: "power3.out",
                    delay: 0.2
                });
            }
        });

        // Expertise Grid Stagger
        gsap.from(".ind-expert-card", {
            scrollTrigger: { trigger: ".ind-expertise", start: "top 75%" },
            y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out"
        });

        // Quote Section
        gsap.from(".ind-quote-inner", {
            scrollTrigger: { trigger: ".ind-quote-section", start: "top 80%" },
            y: 50, opacity: 0, duration: 1.2, ease: "power3.out"
        });

    } else {
        // Fallback for elements if GSAP fails to load (ensure visibility)
        document.querySelectorAll('.gs-reveal, .gs-reveal-left, .gs-reveal-right, .gs-reveal-grow').forEach(el => {
            el.style.opacity = 1;
            el.style.transform = 'none';
        });
    }

    // ==========================================
    // 3. CANVAS PARTICLES FOR FINAL CTA
    // ==========================================
    const canvas = document.getElementById('ind-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles;

        function initParticles() {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
            particles = [];
            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    r: Math.random() * 2 + 1,
                    dx: (Math.random() - 0.5) * 0.5,
                    dy: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.5 + 0.1
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201, 154, 58, ${p.opacity})`; // Gold particles
                ctx.fill();
                
                // Move
                p.x += p.dx;
                p.y += p.dy;
                
                // Wrap
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;
            });
            requestAnimationFrame(drawParticles);
        }

        initParticles();
        drawParticles();
        window.addEventListener('resize', initParticles);
    }
});
