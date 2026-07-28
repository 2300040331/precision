document.addEventListener("DOMContentLoaded", () => {
    // 2. Modal Logic
    const founderCards = document.querySelectorAll('.founder-card');
    const modals = document.querySelectorAll('.founder-modal');
    const closeButtons = document.querySelectorAll('.fmodal-close');
    const backdrops = document.querySelectorAll('.fmodal-backdrop');

    function openModal(id) {
        const modal = document.getElementById('modal-' + id);
        if (!modal) return;
        
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden'; // prevent background scrolling
        
        // Modal Entrance Animation
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(modal.querySelector('.fmodal-img-col img'), 
                { scale: 1.1, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }
            );
            
            gsap.fromTo(modal.querySelectorAll('.fmodal-text-col > *'), 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 }
            );
        }
    }

    function closeModal() {
        modals.forEach(modal => {
            modal.classList.remove('is-active');
        });
        document.body.style.overflow = '';
    }

    // Attach click events
    founderCards.forEach(card => {
        card.addEventListener('click', () => {
            const founderId = card.getAttribute('data-founder');
            openModal(founderId);
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });
    });

    backdrops.forEach(backdrop => {
        backdrop.addEventListener('click', () => {
            closeModal();
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});
