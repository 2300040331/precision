document.addEventListener("DOMContentLoaded", () => {
    // ═══════════════════════════════════════════════════════════
    // HERO FOUNDERS SHOWCASE INTERACTIVE LOGIC
    // ═══════════════════════════════════════════════════════════
    const showcaseSection = document.querySelector('.founders-showcase');
    
    if (showcaseSection) {
        const nameItems = showcaseSection.querySelectorAll('.founders-showcase__name-item');
        const quoteItems = showcaseSection.querySelectorAll('.founders-showcase__quote-item');
        const quoteDots = showcaseSection.querySelectorAll('.founders-showcase__dot');
        const spotlightCols = showcaseSection.querySelectorAll('.founders-showcase__spotlight-col');
        
        let currentIndex = 0;
        let autoRotateTimer = null;
        let isHovered = false;
        
        function setActiveFounder(index) {
            if (index < 0 || index >= nameItems.length) return;
            currentIndex = index;
            
            // 1. Update Names Index Active State
            nameItems.forEach((item, idx) => {
                if (idx === index) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            
            // 2. Update Spotlight Column on Group Image
            spotlightCols.forEach((col, idx) => {
                if (idx === index) {
                    col.classList.add('active');
                } else {
                    col.classList.remove('active');
                }
            });
            
            // 3. Update Active Quote Item with smooth transition
            quoteItems.forEach((quote, idx) => {
                if (idx === index) {
                    quote.classList.add('active');
                } else {
                    quote.classList.remove('active');
                }
            });
            
            // 4. Update Quote Indicator Dots
            quoteDots.forEach((dot, idx) => {
                if (idx === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Attach click & hover events to Name items
        nameItems.forEach((item, idx) => {
            item.addEventListener('mouseenter', () => {
                isHovered = true;
                setActiveFounder(idx);
            });
            item.addEventListener('mouseleave', () => {
                isHovered = false;
            });
            item.addEventListener('click', () => {
                setActiveFounder(idx);
            });
        });
        
        // Attach click events to Quote Dots
        quoteDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                setActiveFounder(idx);
            });
        });
        
        // Auto rotate quotes every 6 seconds when user is not hovering
        function startAutoRotate() {
            stopAutoRotate();
            autoRotateTimer = setInterval(() => {
                if (!isHovered) {
                    const nextIndex = (currentIndex + 1) % nameItems.length;
                    setActiveFounder(nextIndex);
                }
            }, 6000);
        }
        
        function stopAutoRotate() {
            if (autoRotateTimer) {
                clearInterval(autoRotateTimer);
                autoRotateTimer = null;
            }
        }
        
        showcaseSection.addEventListener('mouseenter', () => { isHovered = true; });
        showcaseSection.addEventListener('mouseleave', () => { isHovered = false; });
        
        // IntersectionObserver for entrance reveal animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    showcaseSection.classList.add('is-visible');
                }
            });
        }, { threshold: 0.15 });
        
        observer.observe(showcaseSection);
        
        // Initialize first active founder (Azmal)
        setActiveFounder(0);
        startAutoRotate();
    }

    // ═══════════════════════════════════════════════════════════
    // Legacy Modal Logic Failsafe (for existing modal triggers)
    // ═══════════════════════════════════════════════════════════
    const founderCards = document.querySelectorAll('.founder-card');
    const modals = document.querySelectorAll('.founder-modal');
    const closeButtons = document.querySelectorAll('.fmodal-close');
    const backdrops = document.querySelectorAll('.fmodal-backdrop');

    function openModal(id) {
        const modal = document.getElementById('modal-' + id);
        if (!modal) return;
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modals.forEach(modal => modal.classList.remove('is-active'));
        document.body.style.overflow = '';
    }

    founderCards.forEach(card => {
        card.addEventListener('click', () => {
            const founderId = card.getAttribute('data-founder');
            openModal(founderId);
        });
    });

    closeButtons.forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); closeModal(); }));
    backdrops.forEach(backdrop => backdrop.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
});
