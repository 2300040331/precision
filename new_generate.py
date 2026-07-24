import json
import os

def get_head_nav(title):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | Precision & Co</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
    
    <!-- External Libraries -->
    <script src="https://unpkg.com/@studio-freight/lenis@1.0.39/dist/lenis.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    
    <!-- Stylesheet -->
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="services-premium.css">
</head>
<body class="page-service-detail">
    <header class="navbar" id="navbar">
        <div class="container navbar__inner">
            <a href="index.html" class="navbar__logo" aria-label="Precision & Co Home">
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
                    <li><a href="index.html" class="nav-link">Home</a></li>
                    <li class="nav-dropdown">
                        <a href="#" class="nav-link">
                            What We Do
                            <svg class="nav-link__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                        </a>
                        <div class="mega-menu">
                            <div class="mega-menu__inner">
                                <div class="mega-menu__sidebar">
                                    <div class="mega-menu__group">
                                        <div class="mega-menu__category">Services <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mega-menu__chevron"><path d="m9 18 6-6-6-6"/></svg></div>
                                        <div class="mega-menu__pane">
                                            <a href="services-audit.html" class="mega-menu__item">Audit & Assurance</a>
                                            <div class="tax-group">
                                                <a href="services-tax.html" class="mega-menu__item" style="padding-bottom: 0;">Taxation</a>
                                                <div class="tax-submenu">
                                                    <a href="services-tax.html" class="mega-menu__item" style="padding-left: 1rem; font-size: 0.8rem; padding-top: 4px; padding-bottom: 4px;">Direct Tax</a>
                                                    <a href="services-tax.html" class="mega-menu__item" style="padding-left: 1rem; font-size: 0.8rem; padding-top: 0;">GST & Indirect Tax</a>
                                                </div>
                                            </div>
                                            <a href="services-consulting.html" class="mega-menu__item">Business Advisory</a>
                                            <a href="services-vcfo.html" class="mega-menu__item">Virtual CFO</a>
                                            <a href="#" class="mega-menu__item">Accounting & Bookkeeping</a>
                                            <a href="#" class="mega-menu__item">Company Law & ROC</a>
                                            <a href="#" class="mega-menu__item">Startup Advisory</a>
                                            <a href="#" class="mega-menu__item">Regulatory Compliance</a>
                                            <a href="#" class="mega-menu__item">Transaction Advisory</a>
                                            <a href="services-risk.html" class="mega-menu__item">Risk Advisory</a>
                                            <a href="#" class="mega-menu__item">Valuation</a>
                                            <a href="#" class="mega-menu__item">Wealth Advisory</a>
                                        </div>
                                    </div>
                                    <div class="mega-menu__group">
                                        <div class="mega-menu__category">Industries <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mega-menu__chevron"><path d="m9 18 6-6-6-6"/></svg></div>
                                        <div class="mega-menu__pane">
                                            <a href="industries.html" class="mega-menu__item">Manufacturing</a>
                                            <a href="industries.html" class="mega-menu__item">Technology</a>
                                            <a href="industries.html" class="mega-menu__item">Healthcare</a>
                                            <a href="industries.html" class="mega-menu__item">Banking & Finance</a>
                                            <a href="industries.html" class="mega-menu__item">Real Estate</a>
                                            <a href="industries.html" class="mega-menu__item">Retail & E-Commerce</a>
                                            <a href="industries.html" class="mega-menu__item">Education</a>
                                            <a href="industries.html" class="mega-menu__item">Hospitality</a>
                                            <a href="industries.html" class="mega-menu__item">Energy</a>
                                            <a href="industries.html" class="mega-menu__item">Logistics</a>
                                            <a href="industries.html" class="mega-menu__item">Government</a>
                                            <a href="industries.html" class="mega-menu__item">Startups</a>
                                            <a href="industries.html" class="mega-menu__item">Infrastructure</a>
                                            <a href="industries.html" class="mega-menu__item">NGOs</a>
                                            <a href="industries.html" class="mega-menu__item">Global Business</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li><a href="#founders" class="nav-link">Meet our founders</a></li>
                    <li><a href="why-choose-us.html" class="nav-link">Why Choose Us</a></li>
                    <li><a href="#contact" class="nav-link">Contact Us</a></li>
                </ul>
            </nav>

            <a href="#contact" class="btn btn-outline btn-outline--light navbar__cta">
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

def get_footer():
    return """
    <footer class="footer section-padding">
        <div class="container">
            <div class="footer__bottom"><p>&copy; 2026 Precision &amp; Co. All rights reserved.</p></div>
        </div>
    </footer>
    <script src="script.js"></script>
    <script src="services-animations.js"></script>
</body>
</html>
"""

def generate_18_sections(service_name, subtitle, desc):
    return f"""
    <main>
        <!-- 1 HERO SECTION -->
        <section class="svc-hero">
            <div class="svc-hero__bg"></div>
            <div class="container svc-hero__container">
                <h1 class="svc-hero__title gsap-reveal">{service_name}</h1>
                <h3 class="svc-hero__subtitle gsap-reveal">{subtitle}</h3>
                <p class="svc-hero__desc gsap-reveal">{desc}</p>
                <div class="svc-hero__ctas gsap-reveal">
                    <a href="#contact" class="btn btn-primary">Book Consultation</a>
                    <a href="#overview" class="btn btn-outline">Learn More</a>
                </div>
                <div class="svc-hero__stats gsap-reveal">
                    <div class="stat-card"><h2>$2B+</h2><p>Assets Audited</p></div>
                    <div class="stat-card"><h2>99.9%</h2><p>Accuracy</p></div>
                </div>
            </div>
        </section>

        <!-- 2 SERVICE OVERVIEW -->
        <section id="overview" class="svc-overview section-padding">
            <div class="container svc-overview__grid">
                <div class="svc-overview__content gsap-fade-up">
                    <h2 class="section-title">The Foundation of Trust</h2>
                    <p>Our {service_name} services are designed to provide unparalleled insights and regulatory assurance. We go beyond the numbers to uncover the true narrative of your business.</p>
                    <blockquote class="premium-quote">
                        "Precision Henna transformed our approach to {service_name}, delivering clarity and confidence."
                    </blockquote>
                </div>
                <div class="svc-overview__illustration gsap-fade-left">
                    <div class="abstract-shape"></div>
                </div>
            </div>
        </section>

        <!-- 3 WHY THIS SERVICE MATTERS -->
        <section class="svc-matters section-padding dark-bg">
            <div class="container">
                <h2 class="section-title text-center gsap-fade-up">Why It Matters</h2>
                <div class="matters-grid">
                    <div class="matter-card glass-panel gsap-stagger"><h3>Compliance</h3><p>Ensure adherence to the latest regulations.</p></div>
                    <div class="matter-card glass-panel gsap-stagger"><h3>Risk Reduction</h3><p>Identify and mitigate potential vulnerabilities.</p></div>
                    <div class="matter-card glass-panel gsap-stagger"><h3>Financial Accuracy</h3><p>Maintain pristine records for stakeholders.</p></div>
                    <div class="matter-card glass-panel gsap-stagger"><h3>Business Growth</h3><p>Unlock strategic insights for scaling.</p></div>
                </div>
            </div>
        </section>

        <!-- 4 WHAT WE DO -->
        <section class="svc-wedo section-padding">
            <div class="container">
                <h2 class="section-title text-center gsap-fade-up">What We Do</h2>
                <div class="alternating-timeline">
                    <div class="alt-block left gsap-slide-right">
                        <div class="alt-icon">✦</div>
                        <h3>Comprehensive Review</h3>
                        <p>Deep-dive analysis into your current operations.</p>
                    </div>
                    <div class="alt-block right gsap-slide-left">
                        <div class="alt-icon">✦</div>
                        <h3>Strategic Planning</h3>
                        <p>Customized roadmaps aligning with your goals.</p>
                    </div>
                    <div class="alt-line"></div>
                </div>
            </div>
        </section>

        <!-- 5 OUR APPROACH -->
        <section class="svc-approach section-padding light-bg">
            <div class="container">
                <h2 class="section-title text-center gsap-fade-up">Our Approach</h2>
                <div class="interactive-workflow gsap-fade-up">
                    <div class="workflow-step"><span>1</span>Discover</div>
                    <div class="workflow-step"><span>2</span>Understand</div>
                    <div class="workflow-step"><span>3</span>Plan</div>
                    <div class="workflow-step"><span>4</span>Execute</div>
                    <div class="workflow-step"><span>5</span>Review</div>
                    <div class="workflow-step"><span>6</span>Deliver</div>
                </div>
            </div>
        </section>

        <!-- 6 SCOPE OF SERVICES -->
        <section class="svc-scope section-padding">
            <div class="container">
                <h2 class="section-title text-center gsap-fade-up">Scope of Services</h2>
                <div class="scope-grid">
                    <div class="scope-item gsap-stagger"><h4>Core {service_name}</h4><p>Foundational analysis and reporting.</p></div>
                    <div class="scope-item gsap-stagger"><h4>Advanced Advisory</h4><p>Strategic insights and forecasting.</p></div>
                    <div class="scope-item gsap-stagger"><h4>Regulatory Checks</h4><p>Ensuring compliance across jurisdictions.</p></div>
                    <div class="scope-item gsap-stagger"><h4>Process Optimization</h4><p>Streamlining internal workflows.</p></div>
                </div>
            </div>
        </section>

        <!-- 7 INDUSTRIES WE SERVE -->
        <section class="svc-industries section-padding dark-bg">
            <div class="container">
                <h2 class="section-title text-center gsap-fade-up">Industries We Serve</h2>
                <div class="industry-showcase">
                    <div class="ind-card gsap-stagger"><div class="ind-overlay"><h4>Technology</h4></div></div>
                    <div class="ind-card gsap-stagger"><div class="ind-overlay"><h4>Healthcare</h4></div></div>
                    <div class="ind-card gsap-stagger"><div class="ind-overlay"><h4>Finance</h4></div></div>
                </div>
            </div>
        </section>

        <!-- 8 BUSINESS CHALLENGES -->
        <section class="svc-challenges section-padding">
            <div class="container split-screen">
                <div class="challenges-list gsap-fade-right">
                    <h2 class="section-title">Common Challenges</h2>
                    <ul>
                        <li>Poor Internal Controls</li>
                        <li>Compliance Risks</li>
                        <li>Financial Leakages</li>
                        <li>Manual Processes</li>
                    </ul>
                </div>
                <div class="challenges-infographic gsap-fade-left">
                    <div class="animated-circle"></div>
                </div>
            </div>
        </section>

        <!-- 9 OUR SOLUTIONS -->
        <section class="svc-solutions section-padding light-bg">
            <div class="container">
                <h2 class="section-title text-center gsap-fade-up">Our Solutions</h2>
                <div class="comparison-cards">
                    <div class="comp-card gsap-fade-up"><h5>Challenge</h5><p>Data Silos</p></div>
                    <div class="comp-arrow gsap-fade-up">➔</div>
                    <div class="comp-card gsap-fade-up"><h5>Solution</h5><p>Integrated Dashboards</p></div>
                </div>
            </div>
        </section>

        <!-- 10 KEY DELIVERABLES -->
        <section class="svc-deliverables section-padding">
            <div class="container">
                <h2 class="section-title text-center gsap-fade-up">Key Deliverables</h2>
                <div class="dashboard-layout glass-panel gsap-fade-up">
                    <div class="dash-sidebar">Menu</div>
                    <div class="dash-main">
                        <div class="deliv-card">Audit Report <span>↓</span></div>
                        <div class="deliv-card">Risk Assessment <span>↓</span></div>
                        <div class="deliv-card">Executive Summary <span>↓</span></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 11 BENEFITS -->
        <section class="svc-benefits section-padding dark-bg">
            <div class="container">
                <h2 class="section-title text-center gsap-fade-up">Strategic Benefits</h2>
                <div class="benefits-grid">
                    <div class="benefit-card gsap-stagger"><h2>98%</h2><p>Enhanced Compliance</p></div>
                    <div class="benefit-card gsap-stagger"><h2>2x</h2><p>Operational Efficiency</p></div>
                    <div class="benefit-card gsap-stagger"><h2>Top</h2><p>Investor Confidence</p></div>
                </div>
            </div>
        </section>

        <!-- 12 WHY PRECISION HENNA -->
        <section class="svc-trust section-padding">
            <div class="container">
                <h2 class="section-title text-center gsap-fade-up">Why Precision Henna</h2>
                <div class="trust-grid">
                    <div class="trust-item gsap-stagger"><h4>Global Expertise</h4><p>World-class advisory team.</p></div>
                    <div class="trust-item gsap-stagger"><h4>Tech-Driven</h4><p>Modern analytical tools.</p></div>
                    <div class="trust-item gsap-stagger"><h4>Ethical Practices</h4><p>Uncompromising integrity.</p></div>
                    <div class="trust-item gsap-stagger"><h4>End-to-End</h4><p>Comprehensive support.</p></div>
                </div>
            </div>
        </section>

        <!-- 13 INDUSTRY APPLICATIONS -->
        <section class="svc-applications section-padding light-bg">
            <div class="container">
                <h2 class="section-title text-center gsap-fade-up">Industry Applications</h2>
                <div class="app-row gsap-fade-up">
                    <div class="app-img"></div>
                    <div class="app-content"><h3>Manufacturing</h3><p>Optimizing supply chain finances and cost structures.</p></div>
                </div>
                <div class="app-row reverse gsap-fade-up">
                    <div class="app-img"></div>
                    <div class="app-content"><h3>Startups</h3><p>Scalable financial modeling and runway analysis.</p></div>
                </div>
            </div>
        </section>

        <!-- 14 PROCESS TIMELINE -->
        <section class="svc-process section-padding">
            <div class="container">
                <h2 class="section-title text-center gsap-fade-up">Process Timeline</h2>
                <div class="horizontal-roadmap gsap-fade-up">
                    <div class="road-step">Planning</div>
                    <div class="road-step">Execution</div>
                    <div class="road-step">Reporting</div>
                    <div class="road-step">Review</div>
                </div>
            </div>
        </section>

        <!-- 15 FAQ -->
        <section class="svc-faq section-padding light-bg">
            <div class="container">
                <h2 class="section-title text-center gsap-fade-up">Frequently Asked Questions</h2>
                <div class="premium-accordion gsap-fade-up">
                    <div class="acc-item"><div class="acc-head">How long does an engagement take? <span>+</span></div></div>
                    <div class="acc-item"><div class="acc-head">What is required from our team? <span>+</span></div></div>
                    <div class="acc-item"><div class="acc-head">Do you support international compliance? <span>+</span></div></div>
                </div>
            </div>
        </section>

        <!-- 16 RELATED SERVICES -->
        <section class="svc-related section-padding">
            <div class="container">
                <h2 class="section-title text-center gsap-fade-up">Related Services</h2>
                <div class="related-carousel gsap-fade-up">
                    <div class="rel-card"><h4>Tax Advisory</h4></div>
                    <div class="rel-card"><h4>Virtual CFO</h4></div>
                    <div class="rel-card"><h4>Risk & Compliance</h4></div>
                </div>
            </div>
        </section>

        <!-- 17 CLIENT TESTIMONIALS -->
        <section class="svc-testimonials section-padding dark-bg">
            <div class="container">
                <h2 class="section-title text-center gsap-fade-up">Client Success</h2>
                <div class="testi-slider gsap-fade-up">
                    <div class="testi-card glass-panel">
                        <p>"Exceptional insights and professionalism. Precision Henna elevated our financial governance."</p>
                        <h5>- CEO, Tech Innovators</h5>
                    </div>
                </div>
            </div>
        </section>

        <!-- 18 FINAL CTA -->
        <section class="svc-cta">
            <div class="container text-center gsap-fade-up">
                <h2>Ready to Strengthen Your Business?</h2>
                <p>Partner with us for industry-leading {service_name} services.</p>
                <div class="cta-buttons">
                    <a href="#contact" class="btn btn-primary">Book Consultation</a>
                    <a href="#contact" class="btn btn-outline btn-outline--light">Contact Our Experts</a>
                </div>
            </div>
        </section>
    </main>
"""

services = [
    ("services-audit.html", "Audit & Assurance", "We improve transparency, credibility, and regulatory compliance through rigorous auditing standards.", "Ensuring financial integrity and stakeholder trust."),
    ("services-tax.html", "Tax Advisory", "Strategic tax planning, compliance, and litigation support designed to optimize liabilities and minimize risk.", "Navigating complex tax landscapes with precision."),
    ("services-consulting.html", "Business Consulting", "Growth strategy, financial planning, and operational improvement frameworks.", "Accelerating your path to market leadership."),
    ("services-risk.html", "Risk & Compliance", "Comprehensive regulatory compliance and governance advisory.", "Safeguarding your enterprise against emerging threats."),
    ("services-vcfo.html", "Virtual CFO", "Strategic finance leadership and operational insights without the overhead of a full-time CFO.", "Empowering your business with executive financial acumen.")
]

for filename, title, desc, subtitle in services:
    content = get_head_nav(title) + generate_18_sections(title, subtitle, desc) + get_footer()
    with open(filename, 'w') as f:
        f.write(content)

print("Generated new service pages successfully.")
