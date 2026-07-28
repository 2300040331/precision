import os
from bs4 import BeautifulSoup

dir_path = '/Users/dineshpabbathi/Desktop/precision'

services_data = [
    {
        "filename": "services-accounting.html",
        "title": "Accounting & Bookkeeping",
        "subtitle": "Accurate, compliant, and timely financial records.",
        "desc": "We streamline your financial operations, ensuring clarity and precision in every ledger entry.",
        "intro_heading": "An effective Accounting & Bookkeeping strategy provides a distinct competitive advantage",
        "intro_text": "<p>Precision & Co provides meticulous accounting and bookkeeping services tailored to modern businesses. We ensure that your financial data is not only accurate and up-to-date, but also structured in a way that provides actionable insights for growth.</p><p>From daily ledger management to complex financial reporting, our team leverages advanced software to keep you compliant and informed.</p>",
        "caps": [
            ("Ledger Maintenance", "Daily tracking and categorization of all financial transactions to maintain an accurate general ledger."),
            ("Financial Reporting", "Preparation of monthly, quarterly, and annual financial statements, including balance sheets and income statements."),
            ("Payroll & Compliance", "Seamless payroll processing and adherence to local statutory requirements and tax deductions."),
            ("Virtual CFO Integration", "Connecting your daily books with high-level strategic financial planning.")
        ]
    },
    {
        "filename": "services-company-law.html",
        "title": "Company Law & ROC",
        "subtitle": "Navigating corporate governance and compliance seamlessly.",
        "desc": "We ensure your business adheres to all statutory requirements, minimizing legal risks and maintaining corporate integrity.",
        "intro_heading": "Robust Company Law & ROC compliance provides a solid foundation for growth",
        "intro_text": "<p>Corporate governance is critical to business sustainability. Our Company Law and ROC compliance services are designed to help you navigate complex regulatory frameworks.</p><p>We assist with everything from company incorporation and board meeting documentation to annual ROC filings and statutory compliance, ensuring that your organization operates smoothly within the boundaries of the law.</p>",
        "caps": [
            ("Incorporation Services", "Expert assistance in company registration, structure advisory, and obtaining necessary licenses."),
            ("ROC Filings", "Timely submission of annual returns, financial statements, and other mandatory disclosures."),
            ("Corporate Governance", "Advisory on board meetings, shareholder agreements, and maintaining statutory registers."),
            ("Secretarial Audits", "Comprehensive audits to ensure full adherence to the Companies Act.")
        ]
    },
    {
        "filename": "services-startup.html",
        "title": "Startup Advisory",
        "subtitle": "Fueling growth for the next generation of innovators.",
        "desc": "From seed funding to scaling operations, we provide strategic and financial guidance to help startups thrive.",
        "intro_heading": "Expert Startup Advisory accelerates your journey from idea to enterprise",
        "intro_text": "<p>Startups face unique challenges that require agile and innovative solutions. Our Startup Advisory practice supports entrepreneurs at every stage of their journey.</p><p>We offer comprehensive services including business plan validation, financial modeling, valuation, and investor readiness. Partner with us to build a solid foundation that attracts funding and drives sustainable scale.</p>",
        "caps": [
            ("Financial Modeling", "Creating robust financial projections and scenarios to demonstrate viability to investors."),
            ("Fundraising Support", "Assisting with pitch decks, term sheet negotiations, and connecting with venture capital."),
            ("Virtual CFO for Startups", "Providing high-level financial strategy and cash flow management."),
            ("Structure & Registration", "Setting up the right legal entity to optimize for future funding and tax efficiency.")
        ]
    },
    {
        "filename": "services-regulatory.html",
        "title": "Regulatory Compliance",
        "subtitle": "Safeguarding your business in a complex regulatory environment.",
        "desc": "We proactively manage compliance risks so you can focus on driving your core business forward.",
        "intro_heading": "Proactive Regulatory Compliance transforms risk into a strategic advantage",
        "intro_text": "<p>In an era of increasing regulatory scrutiny, compliance is no longer a reactive necessity but a strategic advantage. Precision & Co helps organizations stay ahead of regulatory changes across various jurisdictions.</p><p>We conduct compliance health checks, implement robust frameworks, and provide ongoing advisory to ensure you meet all legal and industry-specific mandates.</p>",
        "caps": [
            ("Compliance Audits", "Comprehensive reviews to identify gaps in your current regulatory adherence."),
            ("FEMA & RBI Compliance", "Specialized advisory for foreign exchange management and inbound/outbound investments."),
            ("Labour Laws", "Ensuring strict adherence to employment regulations and employee insurance mandates."),
            ("Industry Specific Regs", "Tailored compliance solutions for highly regulated sectors like Healthcare and Finance.")
        ]
    },
    {
        "filename": "services-transaction.html",
        "title": "Transaction Advisory",
        "subtitle": "Maximizing value in complex corporate transactions.",
        "desc": "Expert guidance through mergers, acquisitions, restructuring, and capital raising initiatives.",
        "intro_heading": "Strategic Transaction Advisory unlocks immense stakeholder value",
        "intro_text": "<p>Successful transactions require meticulous planning, rigorous due diligence, and strategic structuring. Our Transaction Advisory team partners with you through every phase of the deal lifecycle.</p><p>Whether you are acquiring a new business, divesting an asset, or raising capital, we provide the deep financial insights needed to negotiate from a position of strength and achieve your strategic objectives.</p>",
        "caps": [
            ("Financial Due Diligence", "In-depth investigation of target companies to uncover financial risks."),
            ("M&A Advisory", "End-to-end support for mergers and acquisitions, from target to integration."),
            ("Deal Structuring", "Optimizing the financial and tax structure of transactions to maximize value."),
            ("Post-Merger Integration", "Seamlessly combining financial systems and cultures post-transaction.")
        ]
    },
    {
        "filename": "services-valuation.html",
        "title": "Valuation Services",
        "subtitle": "Determining precise value with rigorous methodology.",
        "desc": "Independent and defensible valuations for businesses, intangibles, and complex financial instruments.",
        "intro_heading": "Accurate Valuation Services form the bedrock of critical financial decisions",
        "intro_text": "<p>Understanding the true value of an asset or business is critical for strategic decision-making. Our Valuation experts combine advanced financial modeling with deep industry knowledge to deliver robust, defensible valuation reports.</p><p>We assist clients with valuations for regulatory compliance, financial reporting, M&A transactions, and internal strategic planning.</p>",
        "caps": [
            ("Business Valuation", "Comprehensive assessment of enterprise value using DCF and market approaches."),
            ("Intangible Assets", "Specialized valuation of brand equity, patents, customer relationships, and goodwill."),
            ("Regulatory Valuation", "Providing certified valuation reports required under the Companies Act and FEMA."),
            ("Financial Reporting", "Fair value measurements for assets and liabilities under Ind AS / IFRS.")
        ]
    },
    {
        "filename": "services-wealth.html",
        "title": "Wealth Advisory",
        "subtitle": "Protecting and growing your legacy for generations.",
        "desc": "Bespoke wealth management, succession planning, and private client services.",
        "intro_heading": "Holistic Wealth Advisory ensures your legacy endures",
        "intro_text": "<p>Preserving and compounding wealth requires a long-term vision and a tailored strategy. Our Wealth Advisory practice serves high-net-worth individuals, family offices, and corporate executives.</p><p>We offer holistic solutions encompassing portfolio allocation, tax optimization, estate planning, and philanthropic structuring, ensuring your legacy is secure and impactful.</p>",
        "caps": [
            ("Estate Planning", "Structuring wills, trusts, and family governance frameworks."),
            ("Investment Strategy", "Objective advisory on asset allocation across public markets and private equity."),
            ("Tax Optimization", "Designing tax-efficient wealth holding structures aligned with your goals."),
            ("Succession Planning", "Ensuring a smooth transition of wealth and business control to the next generation.")
        ]
    },
    {
        "filename": "services-gst.html",
        "title": "GST Services",
        "subtitle": "Simplifying indirect taxation for seamless operations.",
        "desc": "End-to-end GST compliance, advisory, and litigation support.",
        "intro_heading": "Streamlined GST Services eliminate tax friction and maximize efficiency",
        "intro_text": "<p>The Goods and Services Tax (GST) landscape is constantly evolving, presenting ongoing compliance challenges for businesses. Precision & Co provides comprehensive GST services designed to minimize tax friction.</p><p>From initial registration and regular return filings to complex advisory on supply chain structuring and representation before tax authorities, we have you covered.</p>",
        "caps": [
            ("GST Compliance", "Accurate calculation and timely filing of monthly, quarterly, and annual GST returns."),
            ("Advisory & Structuring", "Strategic advice on the GST implications of complex transactions and cross-border trade."),
            ("Litigation Support", "Expert representation during departmental audits, assessments, and appellate proceedings."),
            ("Refund Claims", "End-to-end assistance in preparing and pursuing GST refund applications.")
        ]
    }
]

# Read the base template
template_path = os.path.join(dir_path, 'services-audit.html')
with open(template_path, 'r') as f:
    template_html = f.read()

for s in services_data:
    soup = BeautifulSoup(template_html, 'html.parser')
    
    # 1. Update Title in Head
    if soup.title:
        soup.title.string = f"{s['title']} | Precision & Co"
        
    # 2. Update H1 Title
    h1 = soup.find('h1', class_='svc-hero__title')
    if h1:
        h1.string = s['title']
        
    # 3. Update Subtitle
    h3 = soup.find('h3', class_='svc-hero__subtitle')
    if h3:
        h3.string = s['subtitle']
        
    # 4. Update Desc
    desc = soup.find('p', class_='svc-hero__desc')
    if desc:
        desc.string = s['desc']
        
    # 5. Update Intro Heading
    intro_h2 = soup.select_one('.svc-intro__heading h2')
    if intro_h2:
        intro_h2.string = s['intro_heading']
        
    # 6. Update Intro Text
    intro_text_div = soup.find('div', class_='svc-intro__text')
    if intro_text_div:
        # Clear existing
        intro_text_div.clear()
        # Parse new text and append
        new_text_soup = BeautifulSoup(s['intro_text'], 'html.parser')
        intro_text_div.append(new_text_soup)
        
    # 7. Update Capabilities
    cap_cards = soup.find_all('div', class_='cap-card')
    if len(cap_cards) == 4 and len(s['caps']) == 4:
        for i, card in enumerate(cap_cards):
            h3_cap = card.find('h3')
            p_cap = card.find('p')
            if h3_cap:
                h3_cap.string = s['caps'][i][0]
            if p_cap:
                p_cap.string = s['caps'][i][1]
                
    # Optional: Update the active state in the mobile sidebar/navigation if needed
    # (Leaving it alone is fine if it's not prominently styled)
                
    # Save the file
    out_path = os.path.join(dir_path, s['filename'])
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(str(soup))
        
print("Successfully generated all service pages with correct content.")
