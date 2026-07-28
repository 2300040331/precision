import os
import re

dir_path = '/Users/dineshpabbathi/Desktop/precision'
index_path = os.path.join(dir_path, 'home.html')

with open(index_path, 'r') as f:
    index_html = f.read()

# Base extracts
head_match = re.search(r'<head>.*?</head>', index_html, re.DOTALL)
base_head = head_match.group(0)
base_head = base_head.replace('</head>', '    <link rel="stylesheet" href="industry-detail.css">\n</head>')

nav_match = re.search(r'<header class="navbar".*?</header>', index_html, re.DOTALL)
nav = nav_match.group(0)

footer_match = re.search(r'<footer class="footer".*?</footer>', index_html, re.DOTALL)
footer = footer_match.group(0)

industries = [
    {
        "id": "manufacturing", "name": "Manufacturing", "img": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop",
        "overview": "In an era of supply chain disruptions and margin pressures, we help manufacturing firms optimize capital allocation, manage complex inventories, and achieve long-term scalable growth.",
        "solutions": [
            {"title": "Cost Accounting Models", "desc": "Develop precise cost-accounting frameworks to identify inefficiencies and improve product margins."},
            {"title": "Tax Structuring", "desc": "Strategic tax advisory for capital expansions, including R&D credits for process innovations."},
            {"title": "Supply Chain Advisory", "desc": "Financial risk modeling for supply chain volatility and vendor dependency."}
        ],
        "stats": [{"num": 40, "label": "Factories Audited"}, {"num": 150, "label": "Crore Tax Saved"}]
    },
    {
        "id": "technology", "name": "Technology", "img": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
        "overview": "Technology firms face rapid innovation cycles and complex intellectual property challenges. We provide specialized valuation, structuring, and compliance services to tech innovators.",
        "solutions": [
            {"title": "Revenue Recognition", "desc": "Implementation of complex SaaS revenue recognition frameworks (Ind AS 115 / ASC 606)."},
            {"title": "IP Valuation", "desc": "Strategic valuation of patents, software, and proprietary technology assets."},
            {"title": "M&A Due Diligence", "desc": "Comprehensive financial and tax due diligence for tech acquisitions and mergers."}
        ],
        "stats": [{"num": 120, "label": "Startups Scaled"}, {"num": 500, "label": "Crore Valuations"}]
    },
    {
        "id": "healthcare", "name": "Healthcare", "img": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop",
        "overview": "Healthcare institutions operate in a highly regulated and capital-intensive environment. We deliver financial compliance and operational strategies to hospitals and clinics.",
        "solutions": [
            {"title": "Revenue Cycle Advisory", "desc": "Optimizing billing processes and reducing accounts receivable days."},
            {"title": "Regulatory Compliance", "desc": "Ensuring strict adherence to healthcare financial regulations and funding requirements."},
            {"title": "Facility Expansion", "desc": "Financial modeling and debt structuring for hospital expansions and equipment acquisition."}
        ],
        "stats": [{"num": 50, "label": "Hospitals Advised"}, {"num": 100, "label": "Compliance Audits"}]
    },
    {
        "id": "banking-finance", "name": "Banking & Finance", "img": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop",
        "overview": "We navigate the intricacies of financial services, offering rigorous audit, risk management, and regulatory advisory to banks, NBFCs, and funds.",
        "solutions": [
            {"title": "Risk Advisory", "desc": "Implementation of comprehensive enterprise risk management frameworks."},
            {"title": "Statutory Audits", "desc": "Rigorous statutory and concurrent audits for banking institutions."},
            {"title": "Regulatory Compliance", "desc": "RBI and SEBI compliance advisory for financial services firms."}
        ],
        "stats": [{"num": 30, "label": "Financial Institutions"}, {"num": 5, "label": "Billion AUM Advised"}]
    },
    {
        "id": "real-estate", "name": "Real Estate", "img": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop",
        "overview": "Real estate demands precise capital management and complex tax structuring. We help developers and investors maximize returns across market cycles.",
        "solutions": [
            {"title": "Project Financing", "desc": "Structuring debt and equity for large-scale commercial and residential developments."},
            {"title": "REIT Compliance", "desc": "Advisory and compliance for Real Estate Investment Trusts."},
            {"title": "Capital Gains Strategy", "desc": "Tax-efficient structuring for property transactions and land acquisitions."}
        ],
        "stats": [{"num": 200, "label": "Projects Advised"}, {"num": 10, "label": "Million Sq Ft Audited"}]
    },
    {
        "id": "retail", "name": "Retail & E-Commerce", "img": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop",
        "overview": "From omni-channel taxation to inventory optimization, we provide retail businesses with the financial clarity needed to expand profitably.",
        "solutions": [
            {"title": "Inventory Accounting", "desc": "Advanced valuation methods and shrinkage control frameworks."},
            {"title": "Multi-State Tax", "desc": "Navigating complex GST and cross-border e-commerce tax regulations."},
            {"title": "Margin Analysis", "desc": "Deep-dive profitability analysis across SKUs, channels, and locations."}
        ],
        "stats": [{"num": 300, "label": "Retail Brands"}, {"num": 50, "label": "Crore Inventory Managed"}]
    },
    {
        "id": "education", "name": "Education", "img": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop",
        "overview": "Educational institutions require sustainable financial planning and strict adherence to grant guidelines. We provide specialized not-for-profit advisory.",
        "solutions": [
            {"title": "Endowment Management", "desc": "Financial strategy and reporting for university and school endowments."},
            {"title": "Grant Compliance", "desc": "Ensuring strict adherence to government and private grant requirements."},
            {"title": "Digital Transformation", "desc": "Financial modeling for ed-tech investments and remote learning infrastructure."}
        ],
        "stats": [{"num": 80, "label": "Institutions"}, {"num": 200, "label": "Grants Audited"}]
    },
    {
        "id": "hospitality", "name": "Hospitality", "img": "https://images.unsplash.com/photo-1542314831-c6a420828f79?q=80&w=2000&auto=format&fit=crop",
        "overview": "We help luxury hotels and hospitality groups manage seasonal cash flows, optimize property valuations, and ensure franchise compliance.",
        "solutions": [
            {"title": "Cash Flow Forecasting", "desc": "Dynamic modeling to manage highly seasonal revenue cycles."},
            {"title": "Franchise Audits", "desc": "Ensuring accurate revenue reporting and fee compliance for franchised properties."},
            {"title": "Asset Valuation", "desc": "Strategic valuation of hospitality properties and brand assets."}
        ],
        "stats": [{"num": 45, "label": "Luxury Hotels"}, {"num": 15, "label": "Resort Valuations"}]
    },
    {
        "id": "energy", "name": "Energy", "img": "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2000&auto=format&fit=crop",
        "overview": "Supporting the transition to renewables with complex asset accounting, project finance, and green tax incentive advisory.",
        "solutions": [
            {"title": "Project Finance", "desc": "Financial modeling and debt structuring for solar, wind, and hydro projects."},
            {"title": "Tax Incentives", "desc": "Maximizing green energy tax credits and government subsidies."},
            {"title": "Asset Impairment", "desc": "Rigorous impairment testing for long-term energy infrastructure assets."}
        ],
        "stats": [{"num": 25, "label": "Renewable Projects"}, {"num": 1.5, "label": "GW Capacity Advised"}]
    },
    {
        "id": "logistics", "name": "Logistics", "img": "https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?q=80&w=2000&auto=format&fit=crop",
        "overview": "We optimize supply chain logistics by managing cross-border tariffs, fleet depreciation, and operational cash flows.",
        "solutions": [
            {"title": "Transfer Pricing", "desc": "Advisory on inter-company pricing for global logistics networks."},
            {"title": "Fleet Depreciation", "desc": "Optimizing capital allowances and depreciation for transport fleets."},
            {"title": "Customs & Tariffs", "desc": "Strategic tax planning for cross-border shipping and warehousing."}
        ],
        "stats": [{"num": 60, "label": "Logistics Firms"}, {"num": 1000, "label": "Fleet Assets Tracked"}]
    },
    {
        "id": "government", "name": "Government", "img": "https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?q=80&w=2000&auto=format&fit=crop",
        "overview": "Delivering transparency and accountability, we provide rigorous public sector audits and budgetary advisory for government entities.",
        "solutions": [
            {"title": "Public Sector Audits", "desc": "Independent audits ensuring total transparency and regulatory adherence."},
            {"title": "Budgetary Advisory", "desc": "Strategic resource allocation and fiscal prudence planning."},
            {"title": "Compliance Reporting", "desc": "Detailed financial reporting in accordance with government standards."}
        ],
        "stats": [{"num": 15, "label": "Govt Departments"}, {"num": 100, "label": "Percent Compliance"}]
    },
    {
        "id": "startups", "name": "Startups", "img": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop",
        "overview": "From seed to IPO, we provide high-growth startups with Virtual CFO services, equity structuring, and investor due diligence.",
        "solutions": [
            {"title": "Virtual CFO", "desc": "Strategic financial leadership for scaling startups without full-time costs."},
            {"title": "ESOP Structuring", "desc": "Designing and valuing Employee Stock Ownership Plans."},
            {"title": "Series A/B Audits", "desc": "Rigorous financial audits to prepare for institutional funding rounds."}
        ],
        "stats": [{"num": 150, "label": "Founders Advised"}, {"num": 2, "label": "Billion Raised"}]
    },
    {
        "id": "infrastructure", "name": "Infrastructure", "img": "https://images.unsplash.com/photo-1545459720-aac8509eb02c?q=80&w=2000&auto=format&fit=crop",
        "overview": "Advising on long-term project financing, percentage-of-completion accounting, and complex public-private partnerships (PPP).",
        "solutions": [
            {"title": "PPP Structuring", "desc": "Financial modeling and risk allocation for Public-Private Partnerships."},
            {"title": "Contract Accounting", "desc": "Precise percentage-of-completion revenue recognition for mega-projects."},
            {"title": "Cost Audits", "desc": "Rigorous tracking of project costs to prevent overruns."}
        ],
        "stats": [{"num": 30, "label": "Mega Projects"}, {"num": 500, "label": "Km Highway Audited"}]
    },
    {
        "id": "ngos", "name": "NGOs", "img": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2000&auto=format&fit=crop",
        "overview": "Ensuring donor funds create maximum impact through transparent fund accounting, FCRA compliance, and strict grant management.",
        "solutions": [
            {"title": "FCRA Advisory", "desc": "Navigating complex foreign contribution regulations for global NGOs."},
            {"title": "Fund Accounting", "desc": "Precise tracking and reporting of restricted and unrestricted donor funds."},
            {"title": "NFP Audits", "desc": "Independent audits to assure donors of fiscal responsibility."}
        ],
        "stats": [{"num": 75, "label": "NGOs Supported"}, {"num": 50, "label": "Million Impacted"}]
    },
    {
        "id": "import-export", "name": "Global Business", "img": "https://images.unsplash.com/photo-1493962853295-0fd70327578a?q=80&w=2000&auto=format&fit=crop",
        "overview": "We help global trading companies navigate complex international tax laws, transfer pricing, and multi-currency exposures.",
        "solutions": [
            {"title": "Forex Risk Advisory", "desc": "Hedging strategies to mitigate multi-currency volatility."},
            {"title": "Customs Compliance", "desc": "Strategic planning to optimize duties and tariffs."},
            {"title": "Cross-Border Tax", "desc": "Navigating DTAAs (Double Taxation Avoidance Agreements) and global tax laws."}
        ],
        "stats": [{"num": 40, "label": "Countries Traded"}, {"num": 100, "label": "Transfer Pricing Audits"}]
    }
]

for ind in industries:
    
    head = re.sub(r'<title>.*?</title>', f'<title>{ind["name"]} Industry Expertise | Precision & Co</title>', base_head)
    
    cards_html = ""
    for sol in ind["solutions"]:
        cards_html += f"""
                <div class="idetail-card">
                    <h4>{sol["title"]}</h4>
                    <p>{sol["desc"]}</p>
                </div>
        """
        

    
    html_content = f"""<!DOCTYPE html>
<html lang="en">
{head}
<body class="page-industry-detail">
    {nav}

    <main class="idetail-main">
        <!-- Cinematic Hero -->
        <section class="idetail-hero">
            <div class="idetail-hero-bg" style="background-image: url('{ind["img"]}');"></div>
            <div class="idetail-hero-overlay"></div>
            <div class="idetail-hero-content">
                <p class="idetail-hero-subtitle">Industry Expertise</p>
                <h1 class="idetail-hero-title">{ind["name"]}</h1>
                <div class="idetail-overview-divider"></div>
                <p class="idetail-overview-text">{ind["overview"]}</p>
            </div>
        </section>

        <!-- Solutions Grid -->
        <section class="idetail-solutions">
            <div class="idetail-solutions-inner">
                <h2 class="idetail-section-title">How We Help</h2>
                <div class="idetail-grid">
                    {cards_html}
                </div>
            </div>
        </section>

        <!-- Infinite Marquee -->
        <div class="idetail-marquee-wrap">
            <div class="idetail-marquee">
                <span>Strategic Advisory</span>
                <span>•</span>
                <span>Risk Management</span>
                <span>•</span>
                <span>Tax Structuring</span>
                <span>•</span>
                <span>M&A Due Diligence</span>
                <span>•</span>
                <span>Compliance</span>
                <span>•</span>
                <span>Strategic Advisory</span>
                <span>•</span>
                <span>Risk Management</span>
                <span>•</span>
                <span>Tax Structuring</span>
                <span>•</span>
                <span>M&A Due Diligence</span>
                <span>•</span>
                <span>Compliance</span>
                <span>•</span>
            </div>
        </div>

        <section class="royal-cta">
            <div class="royal-cta__pattern"></div>
            <div class="container royal-cta__container">
                <div class="royal-cta__content">
                    <h2 class="royal-cta__title">Ready to Elevate Your Business?</h2>
                    <p class="royal-cta__text">Partner with Precision & Co. for strategic financial guidance, unmatched expertise, and a commitment to your long-term success.</p>
                    <a href="contact.html" class="royal-cta__btn">
                        <span>Book a Consultation</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                    </a>
                </div>
            </div>
        </section>
    </main>

    {footer}
    
    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <script src="script.js"></script>
    <script src="industry-detail.js"></script>
</body>
</html>
"""
    file_name = f'industry-{ind["id"]}.html'
    with open(os.path.join(dir_path, file_name), 'w') as out_f:
        out_f.write(html_content)
    
print(f"Generated 15 industry detail pages.")
