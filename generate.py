import os

head_nav = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
    
    <!-- Stylesheet -->
    <link rel="stylesheet" href="styles.css">
</head>
<body class="{bodyClass}">

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- HEADER / NAVBAR                                             -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <header class="navbar" id="navbar">
        <div class="container navbar__inner">
            <a href="home.html" class="navbar__logo" aria-label="Precision & Co Home">
                <div class="brand-logo">
                    <div class="brand-logo__icon">
                        <span class="brand-logo__p">P</span>
                        <span class="brand-logo__c">C</span>
                        <svg class="brand-logo__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H10M17 7V14"/></svg>
                    </div>
                    <div class="brand-logo__text-group">
                        <span class="brand-logo__name">PRECISION <span class="gold-text">&amp;</span> CO</span>
                        <span class="brand-logo__divider">
                            <span class="line"></span>
                            <span class="text">CHARTERED ACCOUNTANTS</span>
                            <span class="line"></span>
                        </span>
                    </div>
                </div>
            </a>

            <nav class="navbar__nav" id="main-nav" aria-label="Main navigation">
                <ul class="navbar__menu">
                    <li><a href="home.html" class="nav-link">Home</a></li>
                    <li><a href="services.html" class="nav-link nav-link--active">What We Do</a></li>
                    <li><a href="industries.html" class="nav-link">Industries</a></li>
                    <li><a href="home.html#contact" class="nav-link">Contact Us</a></li>
                </ul>
            </nav>

            <a href="home.html#contact" class="btn btn-outline btn-outline--light navbar__cta">
                Book a Consultation
                <svg class="btn__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </a>

            <button class="navbar__hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
                <span class="navbar__hamburger-line"></span>
                <span class="navbar__hamburger-line"></span>
                <span class="navbar__hamburger-line"></span>
            </button>
        </div>
    </header>
"""

footer = """
    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- FOOTER                                                      -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <footer class="footer">
        <div class="container footer__inner">
            <div class="footer__grid">
                <div class="footer__brand">
                    <h3 class="footer__logo">PRECISION &amp; CO</h3>
                    <p class="footer__desc">
                        Chartered Accountants delivering accuracy, trust, and impactful financial strategies for modern businesses.
                    </p>
                </div>
                <div class="footer__links">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="services-audit.html">Audit & Assurance</a></li>
                        <li><a href="services-tax.html">Tax Advisory</a></li>
                        <li><a href="services-vcfo.html">Virtual CFO</a></li>
                    </ul>
                </div>
                <div class="footer__links">
                    <h4>Industries</h4>
                    <ul>
                        <li><a href="industries.html">Healthcare</a></li>
                        <li><a href="industries.html">Technology</a></li>
                        <li><a href="industries.html">Real Estate</a></li>
                    </ul>
                </div>
                <div class="footer__contact">
                    <h4>Contact</h4>
                    <p>contact@precisionco.in</p>
                    <p>+91 98765 43210</p>
                </div>
            </div>
            <div class="footer__bottom">
                <p>&copy; 2026 Precision &amp; Co. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="script.js"></script>
</body>
</html>
"""

pages = [
    {
        'filename': 'services-audit.html',
        'title': 'Audit & Assurance | Precision & Co',
        'bodyClass': 'page-service-detail',
        'content': """
    <section class="service-detail-hero reveal-up">
        <div class="container">
            <h1 class="services-hero__title">Audit & <br><span class="gold-text">Assurance</span></h1>
            <p class="services-hero__desc">We improve transparency, credibility, and regulatory compliance through rigorous auditing standards.</p>
        </div>
    </section>
    <section class="service-detail-content section-padding">
        <div class="container">
            <div class="feature-grid reveal-up stagger-1" id="audit-grid">
                <div class="feature-card glass-panel audit-card" style="opacity: 0;">Statutory Audit</div>
                <div class="feature-card glass-panel audit-card" style="opacity: 0;">Internal Audit</div>
                <div class="feature-card glass-panel audit-card" style="opacity: 0;">Tax Audit</div>
                <div class="feature-card glass-panel audit-card" style="opacity: 0;">Due Diligence</div>
                <div class="feature-card glass-panel audit-card" style="opacity: 0;">Stock Audit</div>
                <div class="feature-card glass-panel audit-card" style="opacity: 0;">Forensic Audit</div>
            </div>
            
            <div class="process-timeline reveal-up stagger-2" style="margin-top: 4rem;">
                <h4 class="section-subheading">Our Proven Process</h4>
                <div class="timeline-container">
                    <div class="timeline-progress-line" id="audit-timeline-line"></div>
                    <div class="timeline-step audit-step"><div class="timeline-dot">1</div><div class="timeline-content">Consultation</div></div>
                    <div class="timeline-step audit-step"><div class="timeline-dot">2</div><div class="timeline-content">Document Collection</div></div>
                    <div class="timeline-step audit-step"><div class="timeline-dot">3</div><div class="timeline-content">Risk Assessment</div></div>
                    <div class="timeline-step audit-step"><div class="timeline-dot">4</div><div class="timeline-content">Audit Planning</div></div>
                    <div class="timeline-step audit-step"><div class="timeline-dot">5</div><div class="timeline-content">Field Work</div></div>
                    <div class="timeline-step audit-step"><div class="timeline-dot">6</div><div class="timeline-content">Reporting & Recs</div></div>
                </div>
            </div>
        </div>
    </section>
"""
    },
    {
        'filename': 'services-tax.html',
        'title': 'Tax Advisory | Precision & Co',
        'bodyClass': 'page-service-detail',
        'content': """
    <section class="service-detail-hero reveal-up">
        <div class="container">
            <h1 class="services-hero__title">Tax <br><span class="gold-text">Advisory</span></h1>
            <p class="services-hero__desc">Strategic tax planning, compliance, and litigation support designed to optimize liabilities and minimize risk.</p>
        </div>
    </section>
    <section class="service-detail-content section-padding">
        <div class="container">
            <div class="premium-accordion reveal-up stagger-1">
                <h4 class="section-subheading">Required Documentation</h4>
                <div class="accordion-item glass-panel" id="tax-accordion">
                    <div class="accordion-header">Essential KYC & Returns <span>+</span></div>
                    <div class="accordion-content">
                        <ul class="interactive-checklist">
                            <li><input type="checkbox" id="c1"><label for="c1">PAN & Aadhaar</label></li>
                            <li><input type="checkbox" id="c2"><label for="c2">Financial Statements</label></li>
                            <li><input type="checkbox" id="c3"><label for="c3">GST Returns</label></li>
                            <li><input type="checkbox" id="c4"><label for="c4">Salary/Business Records</label></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="benefits-circle-layout reveal-up stagger-2" style="margin-top: 4rem;">
                <h4 class="section-subheading">Strategic Benefits</h4>
                <div class="benefits-nodes" id="tax-nodes">
                    <div class="benefit-node tax-node" style="opacity: 0;"><div class="node-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><span>Reduce Risks</span></div>
                    <div class="benefit-node tax-node" style="opacity: 0;"><div class="node-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg></div><span>Optimize Liabilities</span></div>
                    <div class="benefit-node tax-node" style="opacity: 0;"><div class="node-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></div><span>Timely Compliance</span></div>
                </div>
            </div>
        </div>
    </section>
"""
    },
    {
        'filename': 'services-consulting.html',
        'title': 'Business Consulting | Precision & Co',
        'bodyClass': 'page-service-detail',
        'content': """
    <section class="service-detail-hero reveal-up">
        <div class="container">
            <h1 class="services-hero__title">Business <br><span class="gold-text">Consulting</span></h1>
            <p class="services-hero__desc">Growth strategy, financial planning, and operational improvement frameworks.</p>
        </div>
    </section>
    <section class="service-detail-content section-padding">
        <div class="container">
            <div class="bento-layout reveal-up stagger-1" id="consulting-bento">
                <div class="bento-box bento-large glass-panel consulting-box" style="opacity:0;">
                    <h3>Challenges & Solutions</h3>
                    <p>We identify bottlenecks in operations and scale and implement tailored strategic workflows that drive measurable growth.</p>
                </div>
                <div class="bento-box bento-small glass-panel gold-bg consulting-box" style="opacity:0;">
                    <h3>Success Metrics</h3>
                    <p>KPI tracking, ROI analysis, Margin improvements.</p>
                </div>
                <div class="bento-box bento-wide glass-panel consulting-box" style="opacity:0;">
                    <h3>Engagement Process & Deliverables</h3>
                    <div class="process-arrows">
                        <span>Discovery</span> → <span>Strategy</span> → <span>Execution</span> → <span>Review</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
"""
    },
    {
        'filename': 'services-risk.html',
        'title': 'Risk & Compliance | Precision & Co',
        'bodyClass': 'page-service-detail',
        'content': """
    <section class="service-detail-hero reveal-up">
        <div class="container">
            <h1 class="services-hero__title">Risk & <br><span class="gold-text">Compliance</span></h1>
            <p class="services-hero__desc">Comprehensive regulatory compliance and governance advisory.</p>
        </div>
    </section>
    <section class="service-detail-content section-padding">
        <div class="container">
            <div class="hover-reveal-grid reveal-up stagger-1" id="risk-grid">
                <div class="hover-card risk-card" style="opacity:0;">
                    <div class="hover-card-front">ROC Compliance</div>
                    <div class="hover-card-back">Annual filings, board resolutions, and statutory registers maintenance.</div>
                </div>
                <div class="hover-card risk-card" style="opacity:0;">
                    <div class="hover-card-front">FEMA & RBI</div>
                    <div class="hover-card-back">Cross-border transactions, FDI reporting, and ODI compliance.</div>
                </div>
                <div class="hover-card risk-card" style="opacity:0;">
                    <div class="hover-card-front">Internal Controls</div>
                    <div class="hover-card-back">Process audits, risk matrices, and SOP design.</div>
                </div>
                <div class="hover-card risk-card" style="opacity:0;">
                    <div class="hover-card-front">Labour Laws</div>
                    <div class="hover-card-back">PF, ESI, and localized statutory compliance coverage.</div>
                </div>
            </div>
        </div>
    </section>
"""
    },
    {
        'filename': 'services-vcfo.html',
        'title': 'Virtual CFO | Precision & Co',
        'bodyClass': 'page-service-detail',
        'content': """
    <section class="service-detail-hero reveal-up">
        <div class="container">
            <h1 class="services-hero__title">Virtual <br><span class="gold-text">CFO</span></h1>
            <p class="services-hero__desc">Strategic finance leadership and operational insights without the overhead of a full-time CFO.</p>
        </div>
    </section>
    <section class="service-detail-content section-padding">
        <div class="container">
            <div class="dashboard-mockup glass-panel reveal-up stagger-1" id="vcfo-dash" style="opacity:0;">
                <div class="dash-sidebar">
                    <span class="active">Overview</span>
                    <span>Budgeting</span>
                    <span>Cash Flow</span>
                    <span>KPIs</span>
                    <span>Fundraising</span>
                </div>
                <div class="dash-main">
                    <div class="dash-card-top">
                        <div class="dash-metric">
                            <h5>MIS Reports</h5>
                            <strong>Automated</strong>
                        </div>
                        <div class="dash-metric">
                            <h5>Runway</h5>
                            <strong>18 Months</strong>
                        </div>
                    </div>
                    <div class="dash-chart">
                        <svg viewBox="0 0 100 30" class="animated-chart">
                            <path id="vcfo-chart-path" d="M0,30 Q20,10 40,25 T80,10 T100,5" fill="none" stroke="var(--gold)" stroke-width="2"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </section>
"""
    }
]

for p in pages:
    file_content = head_nav.format(title=p['title'], bodyClass=p['bodyClass']) + "\\n    <!-- MAIN CONTENT -->\\n" + p['content'] + footer
    with open(p['filename'], 'w') as f:
        f.write(file_content)

hub_content = """
    <section class="services-hero reveal-up">
        <div class="container">
            <div class="services-hero__content">
                <h1 class="services-hero__title">
                    Expertise that <br><span class="gold-text">elevates</span> your vision.
                </h1>
                <p class="services-hero__desc">
                    We combine rigorous analysis with strategic foresight to deliver solutions that drive sustainable growth, ensure compliance, and mitigate risks.
                </p>
            </div>
        </div>
    </section>
    <section class="services-hub-grid section-padding">
        <div class="container">
            <div class="service-cards-grid">
                <a href="services-audit.html" class="service-hub-card glass-panel reveal-up stagger-1">
                    <h3>Audit & Assurance</h3>
                    <p>Improve transparency, credibility, and regulatory compliance.</p>
                    <span class="hub-card-arrow">→</span>
                </a>
                <a href="services-tax.html" class="service-hub-card glass-panel reveal-up stagger-2">
                    <h3>Tax Advisory</h3>
                    <p>Strategic tax planning, compliance, and litigation support.</p>
                    <span class="hub-card-arrow">→</span>
                </a>
                <a href="services-consulting.html" class="service-hub-card glass-panel reveal-up stagger-3">
                    <h3>Business Consulting</h3>
                    <p>Growth strategy, financial planning, and operational improvements.</p>
                    <span class="hub-card-arrow">→</span>
                </a>
                <a href="services-risk.html" class="service-hub-card glass-panel reveal-up stagger-4">
                    <h3>Risk & Compliance</h3>
                    <p>Comprehensive regulatory compliance and governance advisory.</p>
                    <span class="hub-card-arrow">→</span>
                </a>
                <a href="services-vcfo.html" class="service-hub-card glass-panel reveal-up stagger-5">
                    <h3>Virtual CFO</h3>
                    <p>Strategic finance leadership and operational insights.</p>
                    <span class="hub-card-arrow">→</span>
                </a>
            </div>
        </div>
    </section>
"""

new_services = head_nav.format(title="Our Services | Precision & Co", bodyClass="page-services-hub") + hub_content + footer
with open('services.html', 'w') as f:
    f.write(new_services)

print("HTML generation successful.")
