/**
 * Why Choose Us - Interactions & Animations
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    });
    window.lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 2. GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Hero Text Reveal
    gsap.fromTo(".wcu-reveal", 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.2 }
    );

    // Fade Up Elements
    gsap.utils.toArray('.wcu-fade-up').forEach(el => {
        gsap.fromTo(el, { y: 50, opacity: 0 }, {
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
            y: 0, opacity: 1, duration: 1, ease: "power3.out"
        });
    });

    // Fade Left/Right
    gsap.utils.toArray('.wcu-fade-left').forEach(el => {
        gsap.fromTo(el, { x: 50, opacity: 0 }, {
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
            x: 0, opacity: 1, duration: 1, ease: "power3.out"
        });
    });
    gsap.utils.toArray('.wcu-fade-right').forEach(el => {
        gsap.fromTo(el, { x: -50, opacity: 0 }, {
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
            x: 0, opacity: 1, duration: 1, ease: "power3.out"
        });
    });

    // Staggered Items (Metrics, Features, Values)
    gsap.utils.toArray('.wcu-counters, .feature-cards-grid, .floating-values, .empower-grid, .story-cards').forEach(container => {
        const items = container.querySelectorAll('.wcu-stagger');
        if(items.length > 0) {
            gsap.fromTo(items, { y: 30, opacity: 0 }, {
                scrollTrigger: { trigger: container, start: "top 90%", toggleActions: "play none none none" },
                y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out"
            });
        }
    });

    // 4. GSAP Infinite Marquee for Working Approach
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        gsap.to(marqueeTrack, {
            xPercent: -50,
            ease: "none",
            duration: 30,
            repeat: -1
        });
        
        // Pause on hover
        marqueeTrack.addEventListener('mouseenter', () => gsap.getTweensOf(marqueeTrack).forEach(t => t.pause()));
        marqueeTrack.addEventListener('mouseleave', () => gsap.getTweensOf(marqueeTrack).forEach(t => t.resume()));
    }

    // Circular Progress Animation
    gsap.utils.toArray('.wcu-scale').forEach(el => {
        gsap.fromTo(el, { scale: 0.8, opacity: 0 }, {
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
            scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)"
        });
    });

    // Counter Animation
    const counters = document.querySelectorAll('.count');
    counters.forEach(counter => {
        // textContent is stable even while the CMS paint guard is active.
        // innerText can be empty for a temporarily hidden element, which
        // would otherwise turn the original metric into "NaN".
        const target = counter.textContent.trim();
        const isPercentage = target.includes('%');
        const isBillion = target.includes('B');
        const isPlus = target.includes('+');
        const num = parseFloat(target.replace(/[^0-9.]/g, ''));
        if (!Number.isFinite(num)) return;

        ScrollTrigger.create({
            trigger: counter,
            start: "top 90%",
            once: true,
            onEnter: () => {
                let obj = { val: 0 };
                gsap.to(obj, {
                    val: num,
                    duration: 2,
                    ease: "power2.out",
                    onUpdate: () => {
                        let text = Math.floor(obj.val);
                        if(isBillion) text = "$" + text + "B";
                        else if(isPercentage) text = text + "%";
                        else if(isPlus) text = text + "+";
                        counter.innerText = text;
                    }
                });
            }
        });
    });

    // FAQ Accordion
    const accItems = document.querySelectorAll('.g-acc-item');
    accItems.forEach(item => {
        const head = item.querySelector('.g-acc-head');
        head.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            accItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // Tech Dashboard Tabs
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
        item.addEventListener('click', () => {
            techItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            // Trigger a quick pulse on the ui to simulate changing data
            gsap.fromTo('.tech-ui', { opacity: 0.5 }, { opacity: 1, duration: 0.3 });
        });
    });
});
