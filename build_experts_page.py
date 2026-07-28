import os
import re

dir_path = '/Users/dineshpabbathi/Desktop/precision'
index_path = os.path.join(dir_path, 'home.html')

with open(index_path, 'r') as f:
    index_html = f.read()

# Extract <head> up to </head>
head_match = re.search(r'<head>.*?</head>', index_html, re.DOTALL)
head = head_match.group(0)
# Append our custom CSS
head = head.replace('</head>', '    <link rel="stylesheet" href="founders.css">\n</head>')
# Replace title
head = re.sub(r'<title>.*?</title>', '<title>Our Founders | Precision & Co</title>', head)

# Extract <header class="navbar"...> up to </header>
nav_match = re.search(r'<header class="navbar".*?</header>', index_html, re.DOTALL)
nav = nav_match.group(0)

# Extract footer
footer_match = re.search(r'<footer class="footer".*?</footer>', index_html, re.DOTALL)
footer = footer_match.group(0)

html_content = f"""<!DOCTYPE html>
<html lang="en">
{head}
<body class="page-founders">
    {nav}

    <main class="founders-main">
        <header class="founders-header gs-reveal">
            <h1 class="founders-title">Meet Our Founders</h1>
            <div class="founders-divider"></div>
            <p class="founders-subtitle">The leadership behind Precision & Co., committed to delivering trusted financial guidance through expertise, integrity, and long-term partnerships.</p>
        </header>

        <section class="founders-grid-container">
            <div class="founders-grid">
                <!-- Founder 1 -->
                <div class="founder-card gs-reveal" data-founder="1">
                    <div class="fcard-img-wrapper">
                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop" alt="Robert Jenkins">
                        <div class="fcard-glass-reflection"></div>
                    </div>
                    <div class="fcard-info">
                        <h2 class="fcard-name">Robert Jenkins</h2>
                        <h3 class="fcard-role">Managing Partner</h3>
                        <p class="fcard-qual">FCA, CFA</p>
                        <p class="fcard-exp">25+ Years Experience</p>
                        <button class="fcard-btn">View Profile <span class="arrow">→</span></button>
                    </div>
                </div>

                <!-- Founder 2 -->
                <div class="founder-card gs-reveal" data-founder="2">
                    <div class="fcard-img-wrapper">
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop" alt="Sarah Mitchell">
                        <div class="fcard-glass-reflection"></div>
                    </div>
                    <div class="fcard-info">
                        <h2 class="fcard-name">Sarah Mitchell</h2>
                        <h3 class="fcard-role">Managing Partner</h3>
                        <p class="fcard-qual">FCA, CPA</p>
                        <p class="fcard-exp">20+ Years Experience</p>
                        <button class="fcard-btn">View Profile <span class="arrow">→</span></button>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- FULLSCREEN MODALS -->
    <!-- Modal 1: Robert -->
    <div class="founder-modal" id="modal-1">
        <div class="fmodal-backdrop"></div>
        <div class="fmodal-content">
            <button class="fmodal-close" aria-label="Close modal">×</button>
            <div class="fmodal-grid">
                <div class="fmodal-text-col">
                    <div class="fmodal-header">
                        <span class="fmodal-label">About Our Founder</span>
                        <h2 class="fmodal-name">Robert Jenkins</h2>
                        <h3 class="fmodal-role">Managing Partner</h3>
                        <p class="fmodal-qual">FCA, CFA</p>
                        <div class="fmodal-divider"></div>
                    </div>
                    
                    <div class="fmodal-body">
                        <h4>Professional Summary</h4>
                        <p>Robert brings over 25 years of extensive experience in strategic financial advisory and complex corporate audits. His visionary approach has helped steer top-tier multinational corporations through rigorous compliance landscapes while optimizing their fiscal strategies.</p>
                        
                        <h4>Core Expertise</h4>
                        <p>M&A Due Diligence, Strategic Auditing, Corporate Governance, Financial Modeling.</p>
                        
                        <h4>Professional Memberships</h4>
                        <p>Fellow of the Institute of Chartered Accountants, CFA Institute.</p>
                        
                        <h4>Industries Served</h4>
                        <p>Financial Services, Technology, Manufacturing.</p>
                        
                        <h4>Favorite Quote</h4>
                        <p class="fmodal-quote">"Integrity is the currency of sustainable growth."</p>
                    </div>
                    
                    <div class="fmodal-footer">
                        <p><strong>Languages:</strong> English, French</p>
                        <p><strong>Email:</strong> robert.j@precisionandco.com | <a href="#">LinkedIn</a></p>
                        <a href="#contact" class="btn btn-primary fmodal-cta">Schedule Consultation</a>
                    </div>
                </div>
                
                <div class="fmodal-img-col">
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop" alt="Robert Jenkins">
                </div>
            </div>
        </div>
    </div>

    <!-- Modal 2: Sarah -->
    <div class="founder-modal" id="modal-2">
        <div class="fmodal-backdrop"></div>
        <div class="fmodal-content">
            <button class="fmodal-close" aria-label="Close modal">×</button>
            <div class="fmodal-grid">
                <div class="fmodal-text-col">
                    <div class="fmodal-header">
                        <span class="fmodal-label">About Our Founder</span>
                        <h2 class="fmodal-name">Sarah Mitchell</h2>
                        <h3 class="fmodal-role">Managing Partner</h3>
                        <p class="fmodal-qual">FCA, CPA</p>
                        <div class="fmodal-divider"></div>
                    </div>
                    
                    <div class="fmodal-body">
                        <h4>Professional Summary</h4>
                        <p>Sarah is a recognized authority in international tax advisory and corporate restructuring. Over her 20+ year career, she has consistently engineered tax-efficient structures that maximize stakeholder value while ensuring unwavering regulatory adherence.</p>
                        
                        <h4>Core Expertise</h4>
                        <p>International Taxation, Corporate Restructuring, Transfer Pricing, Wealth Advisory.</p>
                        
                        <h4>Professional Memberships</h4>
                        <p>Fellow of the Institute of Chartered Accountants, CPA Association.</p>
                        
                        <h4>Industries Served</h4>
                        <p>Real Estate, Healthcare, Retail.</p>
                        
                        <h4>Leadership Philosophy</h4>
                        <p class="fmodal-quote">"True leadership is fostering transparency while navigating complexity."</p>
                    </div>
                    
                    <div class="fmodal-footer">
                        <p><strong>Languages:</strong> English, Spanish</p>
                        <p><strong>Email:</strong> sarah.m@precisionandco.com | <a href="#">LinkedIn</a></p>
                        <a href="#contact" class="btn btn-primary fmodal-cta">Schedule Consultation</a>
                    </div>
                </div>
                
                <div class="fmodal-img-col">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop" alt="Sarah Mitchell">
                </div>
            </div>
        </div>
    </div>

    {footer}
    
    <!-- Scripts -->
    <!-- Ensure GSAP is loaded -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="script.js"></script>
    <script src="founders.js"></script>
</body>
</html>
"""

with open(os.path.join(dir_path, 'experts.html'), 'w') as f:
    f.write(html_content)

print("Generated experts.html")
