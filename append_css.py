css = """
/* ==========================================================================
   SERVICES HUB & DETAIL PAGES
   ========================================================================== */

.page-services-hub .services-hero {
    padding-top: 150px;
    padding-bottom: 50px;
    text-align: center;
}

.services-hub-grid {
    padding: 60px 0 100px;
}

.service-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.service-hub-card {
    display: flex;
    flex-direction: column;
    padding: 40px 30px;
    border-radius: 12px;
    text-decoration: none;
    color: var(--white);
    transition: transform 0.4s ease, box-shadow 0.4s ease, background 0.4s ease;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.service-hub-card h3 {
    font-size: 1.5rem;
    color: var(--gold);
    margin-bottom: 15px;
}

.service-hub-card p {
    flex-grow: 1;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 25px;
}

.hub-card-arrow {
    font-size: 1.5rem;
    color: var(--white);
    transition: transform 0.3s ease;
}

.service-hub-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.08);
}

.service-hub-card:hover .hub-card-arrow {
    transform: translateX(10px);
    color: var(--gold);
}

/* Service Detail Hero */
.page-service-detail .service-detail-hero {
    padding-top: 180px;
    padding-bottom: 80px;
    text-align: center;
    background: radial-gradient(circle at 50% 0%, rgba(201, 163, 107, 0.15), transparent 60%);
}

.service-detail-hero h1 {
    font-size: 4rem;
    margin-bottom: 20px;
}

.service-detail-hero p {
    font-size: 1.2rem;
    max-width: 700px;
    margin: 0 auto;
    color: rgba(255, 255, 255, 0.8);
}

.service-detail-content {
    padding-bottom: 100px;
}

/* Animations */
@keyframes fadeInUp {
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInLeft {
    to { opacity: 1; transform: translateX(0); }
}

@keyframes drawLine {
    to { height: 100%; }
}

@keyframes drawPath {
    to { stroke-dashoffset: 0; }
}

@keyframes floatNode {
    0% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-10px) scale(1.05); }
    100% { transform: translateY(0px) scale(1); }
}

/* Audit Animation */
.audit-card.animate {
    animation: fadeInUp 0.6s ease forwards;
}

.timeline-progress-line.animate {
    animation: drawLine 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.audit-step.animate .timeline-dot {
    background: var(--gold);
    color: var(--bg-dark);
    box-shadow: 0 0 15px rgba(201, 163, 107, 0.5);
    transition: all 0.4s ease 0.3s;
}

.audit-step.animate .timeline-content {
    color: var(--white);
    transition: color 0.4s ease 0.3s;
}

/* Tax Animation */
.tax-node.animate {
    animation: fadeInUp 0.6s ease forwards, floatNode 4s ease-in-out infinite 0.6s;
}

/* Consulting Animation */
.consulting-box.animate {
    animation: slideInLeft 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}
.consulting-box.bento-small.animate {
    animation: fadeInUp 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

/* Risk Animation */
.risk-card.animate {
    animation: fadeInUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

/* VCFO Animation */
#vcfo-dash.animate {
    animation: fadeInUp 0.8s ease forwards;
}

#vcfo-chart-path {
    stroke-dasharray: 200;
    stroke-dashoffset: 200;
}
#vcfo-chart-path.animate {
    animation: drawPath 2s ease forwards 0.5s;
}

"""
with open('styles.css', 'a') as f:
    f.write(css)
