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
head = re.sub(r'<title>.*?</title>', '<title>Our Experts | Precision & Co</title>', head)

# Extract <header class="navbar"...> up to </header>
nav_match = re.search(r'<header class="navbar".*?</header>', index_html, re.DOTALL)
nav = nav_match.group(0)

# Extract footer
footer_match = re.search(r'<footer class="footer".*?</footer>', index_html, re.DOTALL)
footer = footer_match.group(0)

experts_data = [
    {
        "id": "1",
        "name": "Robert Jenkins",
        "role": "Managing Partner",
        "qual": "FCA, CFA",
        "exp": "25+ Years Experience",
        "img": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop"
    },
    {
        "id": "2",
        "name": "Sarah Mitchell",
        "role": "Partner, Tax Advisory",
        "qual": "FCA, CPA",
        "exp": "20+ Years Experience",
        "img": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop"
    },
    {
        "id": "3",
        "name": "Michael Chang",
        "role": "Director, Risk Advisory",
        "qual": "CPA, CISA",
        "exp": "18+ Years Experience",
        "img": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1200&auto=format&fit=crop"
    },
    {
        "id": "4",
        "name": "Elena Rodriguez",
        "role": "Director, Wealth Advisory",
        "qual": "CFP, MBA",
        "exp": "15+ Years Experience",
        "img": "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1200&auto=format&fit=crop"
    },
    {
        "id": "5",
        "name": "David O'Connor",
        "role": "Partner, Audit",
        "qual": "FCA, B.Com",
        "exp": "22+ Years Experience",
        "img": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop"
    },
    {
        "id": "6",
        "name": "Anita Desai",
        "role": "Head of Corporate Law",
        "qual": "LLB, FCS",
        "exp": "19+ Years Experience",
        "img": "https://images.unsplash.com/photo-1598550874175-4d0ef43cb852?q=80&w=1200&auto=format&fit=crop"
    }
]

cards_html = ""
modals_html = ""

for e in experts_data:
    cards_html += f"""
                <div class="founder-card" data-founder="{e['id']}">
                    <div class="fcard-img-wrapper">
                        <img src="{e['img']}" alt="{e['name']}">
                        <div class="fcard-glass-reflection"></div>
                    </div>
                    <div class="fcard-info">
                        <h2 class="fcard-name">{e['name']}</h2>
                        <h3 class="fcard-role">{e['role']}</h3>
                        <p class="fcard-qual">{e['qual']}</p>
                    </div>
                </div>
"""
    modals_html += f"""
    <!-- Modal {e['id']}: {e['name']} -->
    <div class="founder-modal" id="modal-{e['id']}">
        <div class="fmodal-backdrop"></div>
        <div class="fmodal-content">
            <button class="fmodal-close" aria-label="Close modal">×</button>
            <div class="fmodal-grid">
                <div class="fmodal-text-col">
                    <div class="fmodal-header">
                        <span class="fmodal-label">About Our Expert</span>
                        <h2 class="fmodal-name">{e['name']}</h2>
                        <h3 class="fmodal-role">{e['role']}</h3>
                        <p class="fmodal-qual">{e['qual']}</p>
                        <div class="fmodal-divider"></div>
                    </div>
                    
                    <div class="fmodal-body">
                        <h4>Professional Summary</h4>
                        <p>{e['name']} brings {e['exp']} of extensive experience in strategic advisory. A visionary approach has helped steer top-tier multinational corporations through rigorous landscapes while optimizing strategies.</p>
                        
                        <h4>Core Expertise</h4>
                        <p>Strategic Advisory, Corporate Governance, Financial Modeling.</p>
                        
                        <h4>Professional Memberships</h4>
                        <p>Fellow of Professional Institutes.</p>
                        
                        <h4>Industries Served</h4>
                        <p>Financial Services, Technology, Manufacturing.</p>
                    </div>
                    
                    <div class="fmodal-footer">
                        <p><strong>Email:</strong> contact@precisionandco.com | <a href="#">LinkedIn</a></p>
                        <a href="contact.html" class="btn btn-primary fmodal-cta">Schedule Consultation</a>
                    </div>
                </div>
                
                <div class="fmodal-img-col">
                    <img src="{e['img']}" alt="{e['name']}">
                </div>
            </div>
        </div>
    </div>
"""

html_content = f"""<!DOCTYPE html>
<html lang="en">
{head}
<body class="page-founders">
    {nav}

    <main class="founders-main">
        <header class="founders-header">
            <h1 class="founders-title">Our Experts</h1>
            <div class="founders-divider"></div>
            <p class="founders-subtitle">The best industry experts will share their experience and talk about their projects.</p>
        </header>

        <section class="founders-grid-container">
            <div class="founders-grid">
                {cards_html}
            </div>
        </section>
    </main>

    <!-- FULLSCREEN MODALS -->
    {modals_html}

    {footer}
    
    <!-- Scripts -->
    <script src="script.js"></script>
    <script src="founders.js"></script>
</body>
</html>
"""

with open(os.path.join(dir_path, 'experts.html'), 'w') as f:
    f.write(html_content)

print("Generated experts.html with 6 experts in a 3x2 grid")
