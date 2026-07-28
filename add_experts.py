import os

html_snippet = """
    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- OUR EXPERTS SECTION                                         -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section class="experts-section" id="founders">
        <div class="container">
            <div class="experts-header reveal-up">
                <span class="experts-subtitle">Our Experts</span>
                <h2 class="experts-title">Industry Leaders</h2>
            </div>
            <div class="experts-grid">
                <div class="expert-card reveal-up">
                    <div class="expert-card__img-wrapper">
                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" alt="Robert Jenkins" loading="lazy">
                    </div>
                    <div class="expert-card__info">
                        <h3 class="expert-card__name">Robert Jenkins</h3>
                        <span class="expert-card__role">Managing Partner, Audit</span>
                    </div>
                </div>
                <div class="expert-card reveal-up" style="transition-delay: 100ms;">
                    <div class="expert-card__img-wrapper">
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" alt="Sarah Mitchell" loading="lazy">
                    </div>
                    <div class="expert-card__info">
                        <h3 class="expert-card__name">Sarah Mitchell</h3>
                        <span class="expert-card__role">Director, Tax Advisory</span>
                    </div>
                </div>
                <div class="expert-card reveal-up" style="transition-delay: 200ms;">
                    <div class="expert-card__img-wrapper">
                        <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop" alt="David Chen" loading="lazy">
                    </div>
                    <div class="expert-card__info">
                        <h3 class="expert-card__name">David Chen</h3>
                        <span class="expert-card__role">Head of Business Consulting</span>
                    </div>
                </div>
                <div class="expert-card reveal-up">
                    <div class="expert-card__img-wrapper">
                        <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop" alt="Elena Rodriguez" loading="lazy">
                    </div>
                    <div class="expert-card__info">
                        <h3 class="expert-card__name">Elena Rodriguez</h3>
                        <span class="expert-card__role">Virtual CFO</span>
                    </div>
                </div>
                <div class="expert-card reveal-up" style="transition-delay: 100ms;">
                    <div class="expert-card__img-wrapper">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" alt="Michael Chang" loading="lazy">
                    </div>
                    <div class="expert-card__info">
                        <h3 class="expert-card__name">Michael Chang</h3>
                        <span class="expert-card__role">Risk & Compliance Lead</span>
                    </div>
                </div>
                <div class="expert-card reveal-up" style="transition-delay: 200ms;">
                    <div class="expert-card__img-wrapper">
                        <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop" alt="Priya Patel" loading="lazy">
                    </div>
                    <div class="expert-card__info">
                        <h3 class="expert-card__name">Priya Patel</h3>
                        <span class="expert-card__role">Strategy Director</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

"""

css_snippet = """
/* =========================================
   OUR EXPERTS
   ========================================= */
.experts-section {
    background-color: var(--off-white);
    padding: var(--spacing-3xl) 0;
}

.experts-header {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
}

.experts-subtitle {
    font-size: 1rem;
    font-weight: 500;
    color: var(--charcoal-light);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 1rem;
    display: inline-block;
    background: var(--white);
    padding: 0.5rem 1rem;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.experts-title {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 4vw, 3rem);
    color: var(--navy-900);
}

.experts-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 3rem 2rem;
}

@media (min-width: 768px) {
    .experts-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .experts-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

.expert-card {
    display: flex;
    flex-direction: column;
}

.expert-card__img-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1.1;
    overflow: hidden;
    margin-bottom: 1.5rem;
}

.expert-card__img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.expert-card:hover .expert-card__img-wrapper img {
    transform: scale(1.05);
}

.expert-card__info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.expert-card__name {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--navy-900);
    margin-bottom: 0.5rem;
}

.expert-card__role {
    font-family: var(--font-body);
    font-size: 0.875rem;
    color: var(--charcoal);
    background-color: #fceceb; /* matching the subtle highlight from screenshot slightly */
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-weight: 500;
}
"""

index_path = '/Users/dineshpabbathi/Desktop/precision/home.html'
styles_path = '/Users/dineshpabbathi/Desktop/precision/styles.css'

with open(index_path, 'r') as f:
    content = f.read()

# insert before CTA section
target = '<section class="cta-section" id="contact">'
if html_snippet not in content:
    content = content.replace(target, html_snippet + '\n' + target)
    with open(index_path, 'w') as f:
        f.write(content)
    print("Updated home.html")

with open(styles_path, 'r') as f:
    styles_content = f.read()

if ".experts-section" not in styles_content:
    with open(styles_path, 'a') as f:
        f.write("\n" + css_snippet)
    print("Updated styles.css")

