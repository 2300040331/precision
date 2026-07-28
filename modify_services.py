import os
import glob
import re

css_append = """
/* NEW INTRO SECTION (KPMG-style) */
.svc-intro__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: flex-start;
}
.svc-intro__heading h2 {
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--svc-navy);
}
.svc-intro__text p {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--svc-gray);
  margin-bottom: 1.5rem;
}

/* NEW CAPABILITIES SECTION (KPMG-style) */
.svc-capabilities .section-title {
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  margin-bottom: 3rem;
  text-align: left;
}
.capabilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}
.cap-card {
  background: var(--svc-white);
  border: 1px solid rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.cap-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.08);
}
.cap-image {
  height: 200px;
  width: 100%;
  overflow: hidden;
}
.cap-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.cap-card:hover .cap-image img {
  transform: scale(1.05);
}
.cap-content {
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.cap-content h3 {
  font-size: 1.25rem;
  color: var(--svc-navy);
  margin-bottom: 1rem;
  position: relative;
  padding-left: 1rem;
}
.cap-content h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: var(--svc-gold);
}
.cap-content p {
  font-size: 1rem;
  color: var(--svc-gray);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex: 1;
}
.cap-link {
  font-weight: 600;
  color: var(--svc-navy);
  text-decoration: none;
  font-size: 1rem;
  display: inline-block;
  transition: color 0.3s ease;
}
.cap-link:hover {
  color: var(--svc-gold);
}

@media (max-width: 768px) {
  .svc-intro__grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
"""

with open('services-premium.css', 'r') as f:
    css = f.read()

if 'NEW INTRO SECTION' not in css:
    with open('services-premium.css', 'a') as f:
        f.write(css_append)


services_data = {
    'services-audit.html': {
        'name': 'Audit & Assurance',
        'intro1': 'Enhancing stakeholder value is a fundamental concept which drives every management effort in the modern business environment. Progressive organizations have realized that audits should be viewed as a dynamic tool for insight rather than a passive compliance check.',
        'intro2': 'We have developed a total audit capability which encompasses the entire spectrum of financial and operational risk. Our approach is multi-jurisdictional, allowing us to provide quality national and international assurance.',
        'caps': [
            {'title': 'Statutory Audit', 'desc': 'Dedicated audit professionals with in-depth technical knowledge ensuring compliance and transparency.', 'img': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop'},
            {'title': 'Internal Audit', 'desc': 'In today\'s interconnected global economy, leaders are grappling with the complexities of stringently managing internal controls.', 'img': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop'},
            {'title': 'Information Systems Audit', 'desc': 'Technology is the primary driver of operations around the world. We ensure your systems are robust and secure.', 'img': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'},
            {'title': 'Forensic Audit', 'desc': 'Whether dealing with small-scale or large investigations, understanding how to effectively manage risks is crucial.', 'img': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop'}
        ]
    },
    'services-consulting.html': {
        'name': 'Business Consulting',
        'intro1': 'Enhancing shareholder value is a fundamental concept which drives every management effort in the modern business environment. Progressive organizations have realized that strategy should be viewed as a dynamic catalyst rather than a passive plan.',
        'intro2': 'We have developed a total consulting capability which encompasses the entire spectrum of business transformation. Our approach is multi-jurisdictional, delivering impactful national and international advice.',
        'caps': [
            {'title': 'Strategy & Operations', 'desc': 'Our consultants provide actionable insights with in-depth industry knowledge and practical experience.', 'img': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop'},
            {'title': 'Financial Advisory', 'desc': 'In today\'s interconnected economy, leaders are grappling with the complexities of capital allocation and M&A.', 'img': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop'},
            {'title': 'Technology Consulting', 'desc': 'Digital transformation is the primary driver of growth for businesses around the world.', 'img': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop'},
            {'title': 'Human Capital', 'desc': 'Understanding how to effectively manage and incentivize talent is crucial to long-term success.', 'img': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop'}
        ]
    },
    'services-risk.html': {
        'name': 'Risk & Compliance',
        'intro1': 'Protecting shareholder value is a fundamental concept which drives every management effort in the modern business environment. Progressive leaders have realized that risk should be viewed as a strategic enabler rather than just a compliance hurdle.',
        'intro2': 'We have developed a total risk capability which encompasses the entire spectrum of regulatory and enterprise risks. Our approach is proactive, ensuring robust compliance and resilience globally.',
        'caps': [
            {'title': 'Enterprise Risk Management', 'desc': 'Professionals with in-depth technical knowledge helping you build resilient frameworks.', 'img': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop'},
            {'title': 'Regulatory Compliance', 'desc': 'Navigating the complexities of stringent regulatory requirements across various jurisdictions.', 'img': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop'},
            {'title': 'Cyber Security', 'desc': 'Data protection is the primary concern for digital-first enterprises around the world.', 'img': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop'},
            {'title': 'Corporate Governance', 'desc': 'Understanding how to effectively manage board responsibilities and stakeholder expectations.', 'img': 'https://images.unsplash.com/photo-1436450412740-6b988f486c6b?q=80&w=800&auto=format&fit=crop'}
        ]
    },
    'services-tax.html': {
        'name': 'Tax Advisory',
        'intro1': 'Enhancing a shareholder\'s value is a fundamental concept which drives every management effort in the modern business environment. Progressive and bottom-line focussed managements have realised that taxes should be viewed as a dynamic item of cost rather than a passive charge on the profits.',
        'intro2': 'We have developed a total tax management capability which encompasses the entire spectrum of direct, indirect and personal taxes. Our approach to tax planning is multi-jurisdictional, providing quality national and international tax advice.',
        'caps': [
            {'title': 'Corporate and international tax', 'desc': 'Our Corporate and International Tax (CIT) team comprises dedicated tax professionals with in-depth technical knowledge and practical experience.', 'img': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop'},
            {'title': 'Transfer Pricing', 'desc': 'In today\'s interconnected global economy, tax leaders are grappling with the complexities of transfer pricing and stringent regulatory requirements.', 'img': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop'},
            {'title': 'Indirect Tax', 'desc': 'Taxes are the primary source of income for governments around the world, and managing them effectively is crucial for cash flow.', 'img': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop'},
            {'title': 'Deal advisory & acquisitions tax', 'desc': 'Whether dealing with small-scale or large, cross-border transactions, understanding how to effectively manage tax challenges is crucial.', 'img': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop'}
        ]
    },
    'services-vcfo.html': {
        'name': 'Virtual CFO',
        'intro1': 'Maximizing financial efficiency is a fundamental concept which drives every growth effort in the modern business environment. Progressive startups and SMEs have realized that financial leadership should be viewed as a strategic advantage rather than an overhead cost.',
        'intro2': 'We have developed a comprehensive Virtual CFO capability which encompasses the entire spectrum of financial planning and analysis. Our approach gives you access to executive-level expertise on a flexible basis.',
        'caps': [
            {'title': 'Financial Planning & Analysis', 'desc': 'Dedicated financial professionals with in-depth knowledge helping you forecast and budget effectively.', 'img': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'},
            {'title': 'Cash Flow Management', 'desc': 'In today\'s fast-paced economy, leaders are grappling with the complexities of working capital optimization.', 'img': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop'},
            {'title': 'Fundraising Support', 'desc': 'Capital is the primary fuel for scaling businesses around the world. We help you prepare for investor scrutiny.', 'img': 'https://images.unsplash.com/photo-1531538512162-28caa2fa69bf?q=80&w=800&auto=format&fit=crop'},
            {'title': 'Strategic Advisory', 'desc': 'Whether dealing with new market entry or restructuring, understanding financial implications is crucial to success.', 'img': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop'}
        ]
    }
}

for filename, data in services_data.items():
    if not os.path.exists(filename):
        continue
    
    with open(filename, 'r') as f:
        content = f.read()
        
    intro_html = f"""
        <!-- NEW SERVICE INTRO -->
        <section class="svc-intro section-padding">
            <div class="container svc-intro__grid">
                <div class="svc-intro__heading gsap-fade-up">
                    <h2>An effective {data['name']} strategy provides a distinct competitive advantage</h2>
                </div>
                <div class="svc-intro__text gsap-fade-up">
                    <p>{data['intro1']}</p>
                    <p>{data['intro2']}</p>
                </div>
            </div>
        </section>
        
        <!-- NEW CAPABILITIES SECTION -->
        <section class="svc-capabilities section-padding light-bg">
            <div class="container">
                <h2 class="section-title gsap-fade-up">Our Capabilities</h2>
                <div class="capabilities-grid">
"""
    for cap in data['caps']:
        intro_html += f"""
                    <div class="cap-card gsap-stagger">
                        <div class="cap-image">
                            <img src="{cap['img']}" alt="{cap['title']}">
                        </div>
                        <div class="cap-content">
                            <h3>{cap['title']}</h3>
                            <p>{cap['desc']}</p>
                            <a href="#" class="cap-link">Read more &gt;</a>
                        </div>
                    </div>
"""
    intro_html += """
                </div>
            </div>
        </section>
"""

    pattern = re.compile(r'<!-- 2 SERVICE OVERVIEW -->.*?</section>', re.DOTALL)
    if pattern.search(content):
        new_content = pattern.sub(intro_html, content)
        with open(filename, 'w') as f:
            f.write(new_content)
        print(f"Updated {filename}")
    else:
        print(f"Could not find SERVICE OVERVIEW in {filename}")

