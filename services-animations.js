/**
 * Premium Service Page Animations
 * Uses GSAP ScrollTrigger and Lenis for smooth scrolling
 */

// Initialize animations immediately as script is at the end of body
(function() {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 2. Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 3. Hero Animations
    gsap.from(".gsap-reveal", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.2
    });

    // 4. Fade Up Animations
    gsap.utils.toArray('.gsap-fade-up').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // 5. Stagger Animations (Cards, Grids)
    gsap.utils.toArray('.matters-grid, .scope-grid, .industry-showcase, .benefits-grid, .trust-grid').forEach(container => {
        const items = container.querySelectorAll('.gsap-stagger');
        if(items.length > 0) {
            gsap.from(items, {
                scrollTrigger: {
                    trigger: container,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out"
            });
        }
    });

    // 6. Side Slide Animations (Timeline, Challenges)
    gsap.utils.toArray('.gsap-slide-right').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    gsap.utils.toArray('.gsap-slide-left').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            x: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    gsap.utils.toArray('.gsap-fade-left').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            x: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    gsap.utils.toArray('.gsap-fade-right').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // 7. Parallax Backgrounds (Hero)
    gsap.to(".svc-hero__bg", {
        scrollTrigger: {
            trigger: ".svc-hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        yPercent: 30
    });

    // 8. FAQ Accordion Interaction
    const accHeads = document.querySelectorAll('.acc-head');
    accHeads.forEach(head => {
        head.addEventListener('click', () => {
            head.classList.toggle('active');
            const icon = head.querySelector('span');
            if (head.classList.contains('active')) {
                if(icon) icon.textContent = '-';
            } else {
                if(icon) icon.textContent = '+';
            }
        });
    });
})();
