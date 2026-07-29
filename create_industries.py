import os
import re

dir_path = '/Users/dineshpabbathi/Desktop/precision'
index_path = os.path.join(dir_path, 'home.html')

with open(index_path, 'r') as f:
    index_html = f.read()

# Extract <head> up to </head>
head_match = re.search(r'<head>.*?</head>', index_html, re.DOTALL)
head = head_match.group(0)
head = head.replace('</head>', '    <link rel="stylesheet" href="industries.css">\n</head>')
head = re.sub(r'<title>.*?</title>', '<title>Industries We Serve | Precision & Co</title>', head)

# Extract navbar
nav_match = re.search(r'<header class="navbar".*?</header>', index_html, re.DOTALL)
nav = nav_match.group(0)

# Extract footer
footer_match = re.search(r'<footer class="footer".*?</footer>', index_html, re.DOTALL)
footer = footer_match.group(0)

industries = [
    {"id": "manufacturing", "name": "Manufacturing", "icon": "M4 4h16v16H4z", "img": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop", "overview": "Optimizing supply chains, managing capital expenditures, and driving operational efficiency in a complex global market.", "challenges": "Supply chain volatility, capital-intensive expansion, raw material cost fluctuations.", "helps": "We provide robust cost-accounting models, lean operational advisory, and tax-efficient restructuring."},
    {"id": "technology", "name": "Technology", "icon": "M12 2L2 7l10 5 10-5-10-5z", "img": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop", "overview": "Navigating rapid innovation cycles, IP valuation, and cross-border tech regulations for sustainable scaling.", "challenges": "Revenue recognition (SaaS), R&D tax credits, intellectual property structuring.", "helps": "Strategic valuation, global transfer pricing, and M&A due diligence."},
    {"id": "healthcare", "name": "Healthcare", "icon": "M22 12h-4l-3 9L9 3l-3 9H2", "img": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop", "overview": "Ensuring compliance, managing institutional revenue cycles, and optimizing healthcare infrastructure investments.", "challenges": "Regulatory compliance, billing complexites, scaling facilities.", "helps": "Healthcare audits, revenue cycle advisory, and compliance frameworks."},
    {"id": "real-estate", "name": "Real Estate", "icon": "M3 21v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8", "img": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop", "overview": "Structuring complex real estate transactions, optimizing REITs, and managing large-scale project financing.", "challenges": "Project financing, capital gains management, market cyclicality.", "helps": "Real estate valuations, tax-efficient project structuring, and REIT compliance."},
    {"id": "retail", "name": "Retail & E-Commerce", "icon": "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z", "img": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop", "overview": "Driving retail growth through inventory optimization, multi-state tax compliance, and omni-channel strategy.", "challenges": "Inventory valuation, multi-jurisdiction sales tax, margin compression.", "helps": "Inventory accounting, state & local tax advisory, profitability analysis."},
    {"id": "education", "name": "Education", "icon": "M22 10v6M2 10l10-5 10 5-10 5z", "img": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop", "overview": "Ensuring fiscal sustainability and regulatory compliance for educational institutions and ed-tech innovators.", "challenges": "Endowment management, grant compliance, digital transformation costs.", "helps": "Not-for-profit audits, grant advisory, financial sustainability planning."},
    {"id": "hospitality", "name": "Hospitality", "icon": "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", "img": "https://images.unsplash.com/photo-1542314831-c6a420828f79?q=80&w=1200&auto=format&fit=crop", "overview": "Navigating seasonal revenue cycles, asset management, and franchise compliance in the luxury hospitality sector.", "challenges": "Seasonal cash flow, property valuations, franchise fee auditing.", "helps": "Cash flow forecasting, operational audits, franchise agreement compliance."},
    {"id": "energy", "name": "Energy", "icon": "M13 2L3 14h9l-1 8 10-12h-9l1-8z", "img": "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop", "overview": "Supporting the transition to renewables with project finance, tax incentives, and complex asset accounting.", "challenges": "Capital intensive projects, regulatory shifts, green tax credits.", "helps": "Energy tax credit advisory, project finance modeling, asset impairment testing."},
    {"id": "logistics", "name": "Logistics", "icon": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "img": "https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?q=80&w=1200&auto=format&fit=crop", "overview": "Optimizing fleet operations, cross-border tariffs, and supply chain logistics for global trade.", "challenges": "Fuel cost volatility, cross-border tariffs, fleet depreciation.", "helps": "Transfer pricing, tariff advisory, capital asset management."},
    {"id": "infrastructure", "name": "Infrastructure", "icon": "M2 22h20M12 2v20", "img": "https://images.unsplash.com/photo-1545459720-aac8509eb02c?q=80&w=1200&auto=format&fit=crop", "overview": "Advising on public-private partnerships (PPP), long-term project financing, and contract compliance.", "challenges": "Long-term contract accounting, PPP complexities, cost overruns.", "helps": "Percentage-of-completion accounting, PPP structuring, cost audits."},
    {"id": "government", "name": "Government", "icon": "M4 10h16v10H4z", "img": "https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?q=80&w=1200&auto=format&fit=crop", "overview": "Delivering transparency, accountability, and fiscal prudence for public sector entities.", "challenges": "Budgetary constraints, strict compliance standards, public transparency.", "helps": "Public sector audits, budget advisory, compliance reporting."},
    {"id": "ngos", "name": "NGOs", "icon": "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", "img": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop", "overview": "Ensuring donor funds are managed with maximum impact, transparency, and strict adherence to grant guidelines.", "challenges": "Fund accounting, donor reporting, international grant compliance.", "helps": "NFP audits, fund structuring, FCRA and global grant advisory."},
    {"id": "startups", "name": "Startups", "icon": "M13 10V3L4 14h7v7l9-11h-7z", "img": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop", "overview": "Guiding high-growth startups from seed funding through series rounds, scaling, and eventual IPO or exit.", "challenges": "Cash burn management, equity structuring, Series A/B audits.", "helps": "Virtual CFO, ESOP structuring, investor due diligence."},
    {"id": "professional-services", "name": "Professional Services", "icon": "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", "img": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop", "overview": "Managing partnership equity, partner compensation models, and professional liability structures.", "challenges": "Partner equity management, cash flow timing, profit distributions.", "helps": "Partnership tax returns, equity structuring, cash flow advisory."},
    {"id": "import-export", "name": "Import Export", "icon": "M22 12h-4l-3 9L9 3l-3 9H2", "img": "https://images.unsplash.com/photo-1493962853295-0fd70327578a?q=80&w=1200&auto=format&fit=crop", "overview": "Navigating complex international trade laws, customs duties, and multi-currency financial exposures.", "challenges": "Currency volatility, customs duties, international trade laws.", "helps": "Forex risk advisory, customs compliance, cross-border taxation."}
]

sidebar_links = ""
industry_sections = ""

for i, ind in enumerate(industries):
    sidebar_links += f'<li><a href="industry-{ind["id"]}.html" class="ind-nav-link">{ind["name"]}</a></li>\n'
    
    # Alternating layout: even index = image left, odd index = content left
    is_image_left = (i % 2 == 0)
    layout_class = "ind-layout-img-left" if is_image_left else "ind-layout-content-left"
    
    img_col = f'''
        <div class="ind-col ind-col-img gs-reveal-img">
            <div class="ind-img-wrapper">
                <img src="{ind["img"]}" alt="{ind["name"]}">
            </div>
        </div>
    '''
    
    content_col = f'''
        <div class="ind-col ind-col-text gs-reveal-text">
            <div class="ind-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="{ind["icon"]}"/></svg>
            </div>
            <h2 class="ind-title">{ind["name"]}</h2>
            <div class="ind-divider"></div>
            <p class="ind-overview">{ind["overview"]}</p>
            
            <div class="ind-details">
                <div class="ind-detail-block">
                    <h4>Common Challenges</h4>
                    <p>{ind["challenges"]}</p>
                </div>
                <div class="ind-detail-block">
                    <h4>How Precision & Co. Helps</h4>
                    <p>{ind["helps"]}</p>
                </div>
            </div>
            
            <a href="industry-{ind["id"]}.html" class="ind-cta">Explore Solutions <span class="arrow">→</span></a>
        </div>
    '''
    
    if is_image_left:
        inner_html = img_col + content_col
    else:
        inner_html = content_col + img_col
        
    industry_sections += f'''
        <section class="ind-section" id="{ind["id"]}">
            <div class="ind-floating-block {layout_class}">
                {inner_html}
            </div>
        </section>
    '''


html_content = f"""<!DOCTYPE html>
<html lang="en">
{head}
<body class="page-industries">
    {nav}

    <main class="ind-main">
        <!-- HERO & INTRO WRAPPER -->
        <div class="ind-hero-wrapper">
            <div class="ind-hero-bg"></div>
            <div class="ind-hero-overlay"></div>
            
            <!-- HERO SECTION -->
            <section class="ind-hero">
                <div class="ind-hero-content container">
                    <div class="ind-breadcrumbs gs-reveal">
                        <span>Home</span> <span class="sep">/</span> <span class="current">Industries</span>
                    </div>
                    <h1 class="ind-hero-title gs-reveal">Industries We Serve</h1>
                    <div class="ind-hero-divider gs-reveal-divider"></div>
                    <p class="ind-hero-subtitle gs-reveal">Every industry has unique challenges, regulatory requirements and growth opportunities. We combine deep sector knowledge with financial expertise to help businesses make confident decisions and achieve sustainable success.</p>
                </div>
            </section>

            <!-- INTRODUCTION SPLIT -->
            <section class="ind-intro">
                <div class="container ind-intro-inner">
                    <div class="ind-intro-left gs-reveal-left">
                        <h2>We Understand Businesses Before We Understand Numbers.</h2>
                    </div>
                    <div class="ind-intro-divider gs-reveal-grow"></div>
                    <div class="ind-intro-right gs-reveal-right">
                        <p>True financial guidance goes beyond the balance sheet. Our specialized industry verticals allow us to anticipate market shifts, navigate complex regulatory landscapes, and engineer tailored financial structures that provide our clients with a distinct competitive advantage.</p>
                    </div>
                </div>
            </section>
        </div>

        <!-- MAIN LAYOUT WITH SIDEBAR -->
        <section class="ind-content-area">
            <div class="ind-container">
                
                <!-- STICKY SIDEBAR -->
                <aside class="ind-sidebar">
                    <div class="ind-sidebar-inner">
                        <h3>Industries</h3>
                        <ul class="ind-nav">
                            {sidebar_links}
                        </ul>
                    </div>
                </aside>

                <!-- INDUSTRY SHOWCASE -->
                <div class="ind-sections-wrapper">
                    {industry_sections}
                </div>

            </div>
        </section>
        
        <!-- HOW WE HELP (EXPERTISE) -->
        <section class="ind-expertise">
            <div class="container">
                <h2 class="ind-expertise-title gs-reveal">Our Industry Expertise</h2>
                <div class="ind-expertise-grid">
                    <div class="ind-expert-card gs-reveal">Audit</div>
                    <div class="ind-expert-card gs-reveal">Tax</div>
                    <div class="ind-expert-card gs-reveal">GST</div>
                    <div class="ind-expert-card gs-reveal">Business Advisory</div>
                    <div class="ind-expert-card gs-reveal">Virtual CFO</div>
                    <div class="ind-expert-card gs-reveal">Accounting</div>
                    <div class="ind-expert-card gs-reveal">Compliance</div>
                    <div class="ind-expert-card gs-reveal">Risk Advisory</div>
                    <div class="ind-expert-card gs-reveal">Valuation</div>
                </div>
            </div>
        </section>
        
        <!-- EDITORIAL QUOTE -->
        <section class="ind-quote-section">
            <div class="container ind-quote-inner gs-reveal">
                <div class="ind-quote-mark">“</div>
                <h2 class="ind-quote-text">Every industry speaks a different financial language.<br>We understand each one.</h2>
            </div>
        </section>

        <!-- FINAL CTA -->
        <section class="ind-final-cta">
            <canvas id="ind-particles"></canvas>
            <div class="ind-final-content gs-reveal">
                <h2>Looking for Industry-Specific Financial Expertise?</h2>
                <a href="contact.html" class="ind-btn-gold">Book a Consultation</a>
            </div>
        </section>
    </main>

    {footer}
    
    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <script src="script.js"></script>
    <script src="industries.js"></script>
</body>
</html>
"""

with open(os.path.join(dir_path, 'build_industries.py'), 'w') as f:
    f.write(f'# Generated python script\nhtml_content = """{html_content}"""\nwith open("{os.path.join(dir_path, "industries.html")}", "w") as out: out.write(html_content)')
    
print("Created build script.")
