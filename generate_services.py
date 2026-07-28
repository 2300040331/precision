import os
import glob
from bs4 import BeautifulSoup
import re

dir_path = '/Users/dineshpabbathi/Desktop/precision'

# 1. Read the template
template_path = os.path.join(dir_path, 'services-audit.html')
with open(template_path, 'r') as f:
    template = f.read()

services_data = [
    {
        "filename": "services-accounting.html",
        "title": "Accounting &<br>Bookkeeping",
        "subtitle": "Accurate, compliant, and timely financial records.",
        "desc": "We streamline your financial operations, ensuring clarity and precision in every ledger entry.",
        "img": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2000&auto=format&fit=crop",
        "overview": "Precision & Co provides meticulous accounting and bookkeeping services tailored to modern businesses. We ensure that your financial data is not only accurate and up-to-date, but also structured in a way that provides actionable insights for growth. From daily ledger management to complex financial reporting, our team leverages advanced software to keep you compliant and informed.",
        "cap1_title": "Ledger Maintenance",
        "cap1_desc": "Daily tracking and categorization of all financial transactions to maintain an accurate general ledger.",
        "cap2_title": "Financial Reporting",
        "cap2_desc": "Preparation of monthly, quarterly, and annual financial statements, including balance sheets and income statements.",
        "cap3_title": "Payroll & Compliance",
        "cap3_desc": "Seamless payroll processing and adherence to local statutory requirements and tax deductions."
    },
    {
        "filename": "services-company-law.html",
        "title": "Company Law<br>& ROC",
        "subtitle": "Navigating corporate governance and compliance seamlessly.",
        "desc": "We ensure your business adheres to all statutory requirements, minimizing legal risks and maintaining corporate integrity.",
        "img": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop",
        "overview": "Corporate governance is critical to business sustainability. Our Company Law and ROC compliance services are designed to help you navigate complex regulatory frameworks. We assist with everything from company incorporation and board meeting documentation to annual ROC filings and statutory compliance, ensuring that your organization operates smoothly within the boundaries of the law.",
        "cap1_title": "Incorporation Services",
        "cap1_desc": "Expert assistance in company registration, structure advisory, and obtaining necessary licenses.",
        "cap2_title": "ROC Filings",
        "cap2_desc": "Timely submission of annual returns, financial statements, and other mandatory disclosures to the Registrar of Companies.",
        "cap3_title": "Corporate Governance",
        "cap3_desc": "Advisory on board meetings, shareholder agreements, and maintaining statutory registers."
    },
    {
        "filename": "services-startup.html",
        "title": "Startup<br>Advisory",
        "subtitle": "Fueling growth for the next generation of innovators.",
        "desc": "From seed funding to scaling operations, we provide strategic and financial guidance to help startups thrive.",
        "img": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop",
        "overview": "Startups face unique challenges that require agile and innovative solutions. Our Startup Advisory practice supports entrepreneurs at every stage of their journey. We offer comprehensive services including business plan validation, financial modeling, valuation, and investor readiness. Partner with us to build a solid foundation that attracts funding and drives sustainable scale.",
        "cap1_title": "Financial Modeling",
        "cap1_desc": "Creating robust financial projections and scenarios to demonstrate viability to investors.",
        "cap2_title": "Fundraising Support",
        "cap2_desc": "Assisting with pitch decks, term sheet negotiations, and connecting with venture capital.",
        "cap3_title": "Virtual CFO for Startups",
        "cap3_desc": "Providing high-level financial strategy and cash flow management without the overhead of a full-time executive."
    },
    {
        "filename": "services-regulatory.html",
        "title": "Regulatory<br>Compliance",
        "subtitle": "Safeguarding your business in a complex regulatory environment.",
        "desc": "We proactively manage compliance risks so you can focus on driving your core business forward.",
        "img": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000&auto=format&fit=crop",
        "overview": "In an era of increasing regulatory scrutiny, compliance is no longer a reactive necessity but a strategic advantage. Precision & Co helps organizations stay ahead of regulatory changes across various jurisdictions. We conduct compliance health checks, implement robust frameworks, and provide ongoing advisory to ensure you meet all legal and industry-specific mandates.",
        "cap1_title": "Compliance Audits",
        "cap1_desc": "Comprehensive reviews to identify gaps in your current regulatory adherence and implement corrective measures.",
        "cap2_title": "FEMA & RBI Compliance",
        "cap2_desc": "Specialized advisory for foreign exchange management, inbound/outbound investments, and central bank regulations.",
        "cap3_title": "Labour Laws",
        "cap3_desc": "Ensuring strict adherence to employment regulations, provident fund, and employee insurance mandates."
    },
    {
        "filename": "services-transaction.html",
        "title": "Transaction<br>Advisory",
        "subtitle": "Maximizing value in complex corporate transactions.",
        "desc": "Expert guidance through mergers, acquisitions, restructuring, and capital raising initiatives.",
        "img": "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=2000&auto=format&fit=crop",
        "overview": "Successful transactions require meticulous planning, rigorous due diligence, and strategic structuring. Our Transaction Advisory team partners with you through every phase of the deal lifecycle. Whether you are acquiring a new business, divesting an asset, or raising capital, we provide the deep financial insights needed to negotiate from a position of strength and achieve your strategic objectives.",
        "cap1_title": "Financial Due Diligence",
        "cap1_desc": "In-depth investigation of target companies to uncover financial risks and validate historical performance.",
        "cap2_title": "M&A Advisory",
        "cap2_desc": "End-to-end support for mergers and acquisitions, from target identification to post-merger integration.",
        "cap3_title": "Deal Structuring",
        "cap3_desc": "Optimizing the financial and tax structure of transactions to maximize shareholder value."
    },
    {
        "filename": "services-valuation.html",
        "title": "Valuation<br>Services",
        "subtitle": "Determining precise value with rigorous methodology.",
        "desc": "Independent and defensible valuations for businesses, intangibles, and complex financial instruments.",
        "img": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2000&auto=format&fit=crop",
        "overview": "Understanding the true value of an asset or business is critical for strategic decision-making. Our Valuation experts combine advanced financial modeling with deep industry knowledge to deliver robust, defensible valuation reports. We assist clients with valuations for regulatory compliance, financial reporting, M&A transactions, and internal strategic planning.",
        "cap1_title": "Business Valuation",
        "cap1_desc": "Comprehensive assessment of enterprise value using DCF, market multiples, and asset-based approaches.",
        "cap2_title": "Intangible Assets",
        "cap2_desc": "Specialized valuation of brand equity, patents, customer relationships, and goodwill.",
        "cap3_title": "Regulatory Valuation",
        "cap3_desc": "Providing certified valuation reports required under the Companies Act, FEMA, and Income Tax Act."
    },
    {
        "filename": "services-wealth.html",
        "title": "Wealth<br>Advisory",
        "subtitle": "Protecting and growing your legacy for generations.",
        "desc": "Bespoke wealth management, succession planning, and private client services.",
        "img": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2000&auto=format&fit=crop",
        "overview": "Preserving and compounding wealth requires a long-term vision and a tailored strategy. Our Wealth Advisory practice serves high-net-worth individuals, family offices, and corporate executives. We offer holistic solutions encompassing portfolio allocation, tax optimization, estate planning, and philanthropic structuring, ensuring your legacy is secure and impactful.",
        "cap1_title": "Estate Planning",
        "cap1_desc": "Structuring wills, trusts, and family governance frameworks to ensure smooth intergenerational wealth transfer.",
        "cap2_title": "Investment Strategy",
        "cap2_desc": "Objective advisory on asset allocation across public markets, private equity, and real estate.",
        "cap3_title": "Tax Optimization",
        "cap3_desc": "Designing tax-efficient wealth holding structures aligned with your long-term financial goals."
    },
    {
        "filename": "services-gst.html",
        "title": "GST<br>Services",
        "subtitle": "Simplifying indirect taxation for seamless operations.",
        "desc": "End-to-end GST compliance, advisory, and litigation support.",
        "img": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2000&auto=format&fit=crop",
        "overview": "The Goods and Services Tax (GST) landscape is constantly evolving, presenting ongoing compliance challenges for businesses. Precision & Co provides comprehensive GST services designed to minimize tax friction and maximize efficiency. From initial registration and regular return filings to complex advisory on supply chain structuring and representation before tax authorities, we have you covered.",
        "cap1_title": "GST Compliance",
        "cap1_desc": "Accurate calculation and timely filing of monthly, quarterly, and annual GST returns.",
        "cap2_title": "Advisory & Structuring",
        "cap2_desc": "Strategic advice on the GST implications of complex transactions, contracts, and cross-border trade.",
        "cap3_title": "Litigation Support",
        "cap3_desc": "Expert representation during departmental audits, assessments, and appellate proceedings."
    }
]

for s in services_data:
    new_content = template
    
    # Replace texts in the template
    # Title: Audit &<br>Assurance
    new_content = re.sub(r'Audit &<br>Assurance', s['title'], new_content)
    # Title in head:
    new_content = re.sub(r'<title>Audit & Assurance \| Precision & Co</title>', f'<title>{s["title"].replace("<br>", " ")} | Precision & Co</title>', new_content)
    
    # Subtitle: Ensuring financial integrity and stakeholder trust.
    new_content = re.sub(r'Ensuring financial integrity and stakeholder trust\.', s['subtitle'], new_content)
    
    # Desc: We improve transparency, credibility, and regulatory compliance through rigorous auditing standards.
    new_content = re.sub(r'We improve transparency, credibility, and regulatory compliance through rigorous auditing standards\.', s['desc'], new_content)
    
    # Image:
    new_content = re.sub(r'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40[^"]*', s['img'], new_content)
    
    # Overview heading
    new_content = re.sub(r'Overview: Audit & Assurance', f'Overview: {s["title"].replace("<br>", " ")}', new_content)
    
    # Overview paragraph
    new_content = re.sub(r'<p>At Precision & Co, our audit and assurance services go beyond mere compliance.*?</div>', f'<p>{s["overview"]}</p>\n                    </div>', new_content, flags=re.DOTALL)
    
    # Capabilities (3 cards)
    # 1. Statutory Audit
    new_content = re.sub(r'<h3>Statutory Audit</h3>\s*<p>.*?<a href', f'<h3>{s["cap1_title"]}</h3>\n                            <p>{s["cap1_desc"]}</p>\n                            <a href', new_content, flags=re.DOTALL)
    # 2. Internal Audit
    new_content = re.sub(r'<h3>Internal Audit</h3>\s*<p>.*?<a href', f'<h3>{s["cap2_title"]}</h3>\n                            <p>{s["cap2_desc"]}</p>\n                            <a href', new_content, flags=re.DOTALL)
    # 3. Information Systems Audit
    new_content = re.sub(r'<h3>Information Systems Audit</h3>\s*<p>.*?</div>', f'<h3>{s["cap3_title"]}</h3>\n                            <p>{s["cap3_desc"]}</p>\n                        </div>', new_content, flags=re.DOTALL)
    
    # Fix the active state in sidebar?
    # In services-audit.html, the sidebar might have 'active' class on Audit. We can just leave it or strip it.
    
    with open(os.path.join(dir_path, s['filename']), 'w') as f:
        f.write(new_content)

print(f"Successfully generated {len(services_data)} service pages.")

# Now update all mega menu links across all files
html_files = glob.glob(os.path.join(dir_path, '*.html'))

link_map = {
    'Accounting & Bookkeeping': 'services-accounting.html',
    'Company Law & ROC': 'services-company-law.html',
    'Startup Advisory': 'services-startup.html',
    'Regulatory Compliance': 'services-regulatory.html',
    'Transaction Advisory': 'services-transaction.html',
    'Valuation': 'services-valuation.html',
    'Wealth Advisory': 'services-wealth.html',
    'GST Services': 'services-gst.html'
}

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()

    # Mega Menu
    for text, url in link_map.items():
        # It's currently either href="services.html" or href="services-tax.html" (for GST)
        pattern = r'<a href="[^"]*" class="mega-menu__item">' + re.escape(text) + r'</a>'
        replacement = r'<a href="' + url + r'" class="mega-menu__item">' + text + r'</a>'
        content = re.sub(pattern, replacement, content)

    # In services.html hub cards, they currently point to contact.html
    # e.g., <a href="contact.html" class="service-hub-card glass-panel reveal-up stagger-5">
    #                 <h3>Accounting & Bookkeeping</h3>
    if file.endswith('services.html'):
        for text, url in link_map.items():
            pattern = r'<a href="contact\.html" class="service-hub-card([^>]*)>\s*<h3>' + re.escape(text) + r'</h3>'
            replacement = r'<a href="' + url + r'" class="service-hub-card\1>\n                    <h3>' + text + r'</h3>'
            content = re.sub(pattern, replacement, content)
            
            # also for GST which points to services-tax.html
            pattern2 = r'<a href="services-tax\.html" class="service-hub-card([^>]*)>\s*<h3>' + re.escape(text) + r'</h3>'
            content = re.sub(pattern2, replacement, content)

    with open(file, 'w') as f:
        f.write(content)

print("Updated links across all HTML files.")
