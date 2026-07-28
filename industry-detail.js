document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Parallax
        gsap.to(".idetail-hero-bg", {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: ".idetail-hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            } 
        });

        // Hero text animations removed to ensure visibility

        // Solutions Grid Stagger
        gsap.from(".idetail-card", {
            scrollTrigger: { trigger: ".idetail-solutions", start: "top 75%" },
            y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
        });


        
    }
});
