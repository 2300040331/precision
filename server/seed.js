import { prisma } from './db.js';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding CMS Database...');

  // 1. Seed Super Admin & Users
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@precisionandco.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@precisionandco.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      twoFactor: true,
      lastLogin: new Date(),
    },
  });

  await prisma.user.upsert({
    where: { email: 'editor@precisionandco.com' },
    update: {},
    create: {
      name: 'Senior Content Editor',
      email: 'editor@precisionandco.com',
      password: hashedPassword,
      role: 'EDITOR',
      twoFactor: false,
    },
  });

  // 2. Global Site Settings
  await prisma.setting.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      siteName: 'Precision & Co.',
      tagline: 'Precision in Numbers. Excellence in Business.',
      contactEmail: 'contact@precisionandco.com',
      contactPhone: '+91 98765 43210',
      address: 'Precision House, Level 4, Financial District, Gachibowli, Hyderabad, Telangana 500032',
      workingHours: 'Monday - Saturday: 9:00 AM - 6:30 PM IST',
      socialLinkedin: 'https://linkedin.com/company/precisionandco',
      socialTwitter: 'https://twitter.com/precisionandco',
      socialFacebook: 'https://facebook.com/precisionandco',
      robotsTxt: 'User-agent: *\nAllow: /\nSitemap: https://precisionandco.com/sitemap.xml',
    },
  });

  // 3. Seed Pages & Sections
  const homePage = await prisma.page.upsert({
    where: { id: 'home' },
    update: {},
    create: {
      id: 'home',
      title: 'Home Page',
      slug: 'home',
      metaTitle: 'Precision & Co. | Leading Chartered Accountants & Business Advisors',
      metaDesc: 'Top-tier audit, tax, regulatory, and corporate financial advisory firm empowering enterprises and high-growth businesses.',
      keywords: 'Chartered Accountant, Audit, GST, Income Tax, Valuation, Virtual CFO, Financial Advisory',
    },
  });

  // Home Page Sections (Always clean and re-seed latest content)
  await prisma.section.deleteMany({ where: { pageId: 'home' } });
  await prisma.section.createMany({
    data: [
      {
        pageId: 'home',
        type: 'hero',
        name: 'Hero Section',
        order: 1,
        visible: true,
        content: JSON.stringify({
          title: 'Precision in<br>Numbers.<br>Excellence in<br><span class="gold-text">Business.</span>',
          subtitle: 'ACCURATE. TRUSTED. IMPACTFUL.',
          description: 'We deliver strategic financial solutions with accuracy, integrity and insight to help your business grow with confidence.',
          ctaPrimaryText: 'Our Services',
          ctaPrimaryLink: 'services.html',
          ctaSecondaryText: 'Book a Consultation',
          ctaSecondaryLink: 'contact.html',
          heroImage: 'assets/images/hero-bg.jpg',
        }),
      },
      {
        pageId: 'home',
        type: 'stats',
        name: 'Key Metrics & Value Pillars',
        order: 2,
        visible: true,
        content: JSON.stringify({
          stat1Title: 'Trusted Expertise',
          stat1Text: 'Decades of combined experience you can rely on.',
          stat2Title: 'Strategic Approach',
          stat2Text: 'Solutions tailored to your business goals.',
          stat3Title: 'Value Driven',
          stat3Text: 'Delivering measurable impact and long-term value.',
          stat4Title: 'Client First',
          stat4Text: 'Your success is our commitment.',
        }),
      },
      {
        pageId: 'home',
        type: 'about_preview',
        name: 'About Section Preview',
        order: 3,
        visible: true,
        content: JSON.stringify({
          heading: 'Architects of Financial Clarity and Corporate Governance',
          subheading: 'ABOUT PRECISION & CO.',
          text1: 'Founded by senior Chartered Accountants and industry leaders, Precision & Co. has emerged as a premier multidisciplinary advisory firm providing financial governance, taxation strategy, M&A advisory, and risk management.',
          text2: 'Our team combines deep domain expertise with modern financial technology to provide actionable insights for founders, boards, and institutional investors.',
          vision: 'To be the most trusted financial governance partner for growth-stage enterprises in Asia.',
          mission: 'Uncompromising integrity, rigorous technical standards, and tailored financial solutions for sustainable enterprise growth.',
        }),
      },
      {
        pageId: 'home',
        type: 'services_overview',
        name: 'Services Overview Grid',
        order: 4,
        visible: true,
        content: JSON.stringify({
          heading: 'Comprehensive Financial & Governance Services',
          subheading: 'OUR CORE PRACTICE',
          description: 'From statutory audits to cross-border tax advisory, we provide end-to-end financial leadership.',
        }),
      },
      {
        pageId: 'home',
        type: 'industries_overview',
        name: 'Industries Grid',
        order: 5,
        visible: true,
        content: JSON.stringify({
          heading: 'Specialized Expertise Across Key Sectors',
          subheading: 'INDUSTRIES WE SERVE',
          description: 'Tailored compliance and financial management for manufacturing, technology, healthcare, and global trade.',
        }),
      },
      {
        pageId: 'home',
        type: 'cta',
        name: 'Call to Action Banner',
        order: 6,
        visible: true,
        content: JSON.stringify({
          title: 'Ready to Elevate Your Business?',
          description: 'Partner with Precision & Co. for strategic financial guidance, unmatched expertise, and a commitment to your long-term success.',
          buttonText: 'Book a Consultation',
          buttonLink: 'contact.html',
        }),
      },
      {
        pageId: 'home',
        type: 'footer',
        name: 'Global Footer & Copyright',
        order: 7,
        visible: true,
        content: JSON.stringify({
          copyright: '© 2026 Precision & Co. Chartered Accountants. All rights reserved.',
          tagline: 'Delivering strategic financial solutions with accuracy, integrity, and insight.',
          linkedin: 'https://linkedin.com/company/precisionandco',
          twitter: 'https://twitter.com/precisionandco',
        }),
      },
    ],
  });

  // 4. Seed Services
  const servicesCount = await prisma.service.count();
  if (servicesCount === 0) {
    await prisma.service.createMany({
      data: [
        {
          title: 'Statutory & Financial Audit',
          slug: 'services-audit',
          icon: 'ShieldCheck',
          summary: 'Independent financial statement audits, risk assessment, and statutory compliance under Indian Companies Act.',
          description: 'Our audit practice delivers rigorous, independent evaluation of financial statements to instill investor confidence and fulfill statutory requirements.',
          features: JSON.stringify(['Statutory Audit under Companies Act', 'Internal Financial Controls (IFC)', 'Tax Audit under IT Act', 'Special Purpose Audits']),
          faqs: JSON.stringify([
            { question: 'Who requires a Statutory Audit in India?', answer: 'All companies registered under the Companies Act 2013, regardless of turnover, must undergo an annual statutory audit.' },
          ]),
          order: 1,
        },
        {
          title: 'Direct & Indirect Tax Advisory',
          slug: 'services-tax',
          icon: 'FileSpreadsheet',
          summary: 'Corporate tax planning, GST compliance, international taxation, transfer pricing, and representation.',
          description: 'Strategic tax structuring designed to minimize tax liabilities while maintaining total statutory compliance.',
          features: JSON.stringify(['Corporate Income Tax', 'GST Filing & Audit', 'Transfer Pricing Documentation', 'Tax Litigation & Representation']),
          faqs: JSON.stringify([
            { question: 'How do you handle GST refund claims?', answer: 'We handle end-to-end GST refund filing for exporters and inverted duty structure claims.' },
          ]),
          order: 2,
        },
        {
          title: 'Virtual CFO & Financial Governance',
          slug: 'services-vcfo',
          icon: 'TrendingUp',
          summary: 'Executive financial oversight, cash flow management, investor reporting, and strategic budgeting.',
          description: 'Access top-tier CFO talent on a flexible model to manage budgeting, runway, board reporting, and capital raising strategy.',
          features: JSON.stringify(['Monthly MIS & Board Decks', 'Cash Flow & Burn Optimization', 'Financial Modeling & Valuation', 'ERP Implementation Oversight']),
          faqs: JSON.stringify([
            { question: 'How is Virtual CFO different from a bookkeeper?', answer: 'Virtual CFO provides high-level strategic direction, investor readiness, and executive financial leadership.' },
          ]),
          order: 3,
        },
        {
          title: 'GST Advisory & Annual Filing',
          slug: 'services-gst',
          icon: 'Coins',
          summary: 'Comprehensive Goods & Services Tax (GST) management, GSTR 9/9C reconciliation, and appellate representation.',
          description: 'Seamless GST management ensuring zero compliance friction, timely ITC reconciliation, and notice resolution.',
          features: JSON.stringify(['GST Registration & Amendments', 'GSTR 1, 3B, 9 & 9C Reconciliation', 'Input Tax Credit (ITC) Optimization', 'Departmental Notice Defense']),
          faqs: JSON.stringify([
            { question: 'When is GSTR-9 annual return compulsory?', answer: 'GSTR-9 is compulsory for taxpayers with aggregate turnover exceeding the threshold prescribed by CBIC.' },
          ]),
          order: 4,
        },
        {
          title: 'Valuation & Transaction Advisory',
          slug: 'services-valuation',
          icon: 'PieChart',
          summary: 'Independent business valuations (DCF, Comparable), M&A due diligence, and deal structuring.',
          description: 'Registered Valuer reports for RBI, Income Tax, Companies Act, and investment rounds.',
          features: JSON.stringify(['IBBI Registered Valuation Reports', 'Financial & Legal Due Diligence', 'Share Swap Ratio Determination', 'ESOP Valuation & Structuring']),
          faqs: JSON.stringify([
            { question: 'What valuation methods are accepted by Income Tax?', answer: 'DCF (Discounted Cash Flow) and NAV methods certified by a Registered Valuer or Merchant Banker.' },
          ]),
          order: 5,
        },
        {
          title: 'Company Law & Secretarial Advisory',
          slug: 'services-company-law',
          icon: 'Building',
          summary: 'ROC filings, board resolutions, corporate restructuring, FDI compliance, and FEMA advisory.',
          description: 'End-to-end secretarial support for board management, shareholder agreements, ROC compliance, and corporate filings.',
          features: JSON.stringify(['ROC Filings & Secretarial Records', 'FEMA & RBI Compliance for FDI', 'ESOP Plan Drafting & Grant', 'Fast-Track Merger Advisory']),
          faqs: JSON.stringify([
            { question: 'What are compulsory annual ROC filings?', answer: 'AOC-4 (Financial Statements) and MGT-7 (Annual Return) are mandatory annual filings.' },
          ]),
          order: 6,
        },
      ],
    });
  }

  // 5. Seed Industries
  const industriesCount = await prisma.industry.count();
  if (industriesCount === 0) {
    await prisma.industry.createMany({
      data: [
        {
          title: 'Technology & SaaS',
          slug: 'industry-technology',
          icon: 'Laptop',
          summary: 'Tailored advisory for SaaS, deeptech, IT services, and digital marketplaces.',
          category: 'Technology',
          featured: true,
          stats: JSON.stringify([{ label: 'Active Tech Clients', value: '120+' }, { label: 'Capital Raised Assisted', value: '$150M+' }]),
          benefits: JSON.stringify(['Deferred Revenue Accounting', 'R&D Tax Incentives', 'Global IP Transfer Pricing', 'ESOP Pool Structuring']),
          faqs: JSON.stringify([{ question: 'How do you handle multi-currency SaaS revenue recognition?', answer: 'We align ASC 606 / Ind AS 115 revenue recognition principles across payment gateways.' }]),
          order: 1,
        },
        {
          title: 'Banking & Financial Services (BFSI)',
          slug: 'industry-banking-finance',
          icon: 'Landmark',
          summary: 'Audit, risk management, regulatory compliance for NBFCs, Fintechs, and wealth firms.',
          category: 'Finance',
          featured: true,
          stats: JSON.stringify([{ label: 'AUM Audited', value: '₹12,000 Cr+' }, { label: 'NBFC Approvals', value: '25+' }]),
          benefits: JSON.stringify(['RBI Master Direction Compliance', 'ALM & Risk Frameworks', 'Concurrent & System Audits', 'Fintech Lending Structuring']),
          faqs: JSON.stringify([{ question: 'Do you assist with RBI NBFC registration?', answer: 'Yes, we provide turnkey advisory for COR application with RBI.' }]),
          order: 2,
        },
        {
          title: 'Healthcare & Pharmaceuticals',
          slug: 'industry-healthcare',
          icon: 'Stethoscope',
          summary: 'Compliance, inventory audit, and tax optimization for hospital chains and pharma exporters.',
          category: 'Healthcare',
          featured: false,
          stats: JSON.stringify([{ label: 'Hospital Chains', value: '35+' }, { label: 'Pharma Exporters', value: '45+' }]),
          benefits: JSON.stringify(['GST Inverted Duty Structure Refunds', 'Hospital Inventory Control', 'R&D Tax Subsidies', 'Cross-border Patent Advisory']),
          faqs: JSON.stringify([{ question: 'How to claim GST refund on exports for pharma?', answer: 'We file LUT refund claims under Rule 96A.' }]),
          order: 3,
        },
        {
          title: 'Real Estate & Infrastructure',
          slug: 'industry-real-estate',
          icon: 'Building2',
          summary: 'RERA audit, land acquisition structuring, joint venture accounting, and project tax strategy.',
          category: 'Real Estate',
          featured: false,
          stats: JSON.stringify([{ label: 'Projects Audited', value: '80+' }, { label: 'Square Feet Covered', value: '15M+' }]),
          benefits: JSON.stringify(['RERA Annual Accounts Certification', 'Joint Development Agreement (JDA) Taxing', 'Project Finance Due Diligence', 'REIT Advisory']),
          faqs: JSON.stringify([{ question: 'Is RERA financial audit mandatory?', answer: 'Yes, section 4(2)(l)(D) mandates annual certification by a practicing CA.' }]),
          order: 4,
        },
      ],
    });
  }

  // 6. Seed Consultations
  const consultationCount = await prisma.consultation.count();
  if (consultationCount === 0) {
    await prisma.consultation.createMany({
      data: [
        {
          fullName: 'Vikramaditya Rao',
          email: 'v.rao@apexventures.io',
          phone: '+91 98450 12345',
          company: 'Apex Ventures India',
          serviceSelected: 'Valuation & Transaction Advisory',
          industry: 'Technology & SaaS',
          budget: '₹2,00,000 - ₹5,00,000',
          preferredDate: '2026-08-05',
          preferredTime: '11:00 AM IST',
          message: 'We are raising a Series B round of $12M and need an IBBI Registered Valuation Report and financial due diligence for our investors.',
          status: 'NEW',
          assignedStaff: 'Unassigned',
          sourcePage: '/home.html',
        },
        {
          fullName: 'Priya Sharma',
          email: 'priya@novacarepharma.com',
          phone: '+91 99100 88776',
          company: 'NovaCare Pharma Pvt Ltd',
          serviceSelected: 'GST Advisory & Annual Filing',
          industry: 'Healthcare & Pharmaceuticals',
          budget: '₹1,00,000 - ₹2,00,000',
          preferredDate: '2026-08-04',
          preferredTime: '3:30 PM IST',
          message: 'Requesting assistance with GSTR 9C annual reconciliation and inverted duty GST refund filing for FY 2024-25.',
          status: 'ACCEPTED',
          assignedStaff: 'Prakash V. (Senior Tax Partner)',
          notes: 'Client meeting scheduled over Google Meet. Proposal sent.',
          sourcePage: '/services-gst.html',
        },
        {
          fullName: 'Rajesh Agarwal',
          email: 'rajesh@agrawalbuildcon.in',
          phone: '+91 98220 44332',
          company: 'Agarwal Buildcon Developers',
          serviceSelected: 'Statutory & Financial Audit',
          industry: 'Real Estate & Infrastructure',
          budget: '₹5,00,000+',
          preferredDate: '2026-08-08',
          preferredTime: '2:00 PM IST',
          message: 'Looking for a comprehensive RERA financial audit and company statutory audit for 4 ongoing residential project SPVs.',
          status: 'IN_REVIEW',
          assignedStaff: 'Ananya S. (Audit Partner)',
          sourcePage: '/industry-real-estate.html',
        },
      ],
    });
  }

  // 7. Seed Contact Messages
  const contactCount = await prisma.contactMessage.count();
  if (contactCount === 0) {
    await prisma.contactMessage.createMany({
      data: [
        {
          name: 'Sunil Mehta',
          email: 'smehta@techmatrix.com',
          phone: '+91 98888 11223',
          subject: 'Inquiry regarding Virtual CFO engagement',
          message: 'Hi team, our company is growing rapidly and we require a dedicated Virtual CFO for monthly financial planning and board presentations.',
          status: 'UNREAD',
        },
        {
          name: 'Meera Deshmukh',
          email: 'meera@deshmukh-law.com',
          phone: '+91 97766 55443',
          subject: 'Partnership & Legal Due Diligence',
          message: 'Reaching out to explore mutual referral partnership for M&A transactions in Telangana region.',
          status: 'READ',
          replyNote: 'Replied via phone call on Aug 1st.',
        },
      ],
    });
  }

  // 8. Seed Media Items
  const mediaCount = await prisma.mediaItem.count();
  if (mediaCount === 0) {
    await prisma.mediaItem.createMany({
      data: [
        {
          filename: 'precision-logo-dark.svg',
          originalName: 'precision-logo-dark.svg',
          url: '/assets/logo-dark.svg',
          mimeType: 'image/svg+xml',
          size: 14200,
          dimensions: '400x120',
          altText: 'Precision & Co Official Dark Logo',
          folder: 'logos',
          usageCount: 12,
        },
        {
          filename: 'precision-hero-bg.jpg',
          originalName: 'precision-hero-bg.jpg',
          url: '/assets/hero-bg.jpg',
          mimeType: 'image/jpeg',
          size: 245000,
          dimensions: '1920x1080',
          altText: 'Financial District Corporate Building',
          folder: 'banners',
          usageCount: 5,
        },
        {
          filename: 'audit-services-banner.png',
          originalName: 'audit-services-banner.png',
          url: '/assets/audit-banner.png',
          mimeType: 'image/png',
          size: 380000,
          dimensions: '1200x800',
          altText: 'Chartered Accountant auditing financial ledger',
          folder: 'services',
          usageCount: 3,
        },
      ],
    });
  }

  // 9. Seed Audit Logs
  await prisma.auditLog.create({
    data: {
      userName: 'Super Admin',
      action: 'SYSTEM_INITIALIZATION',
      details: 'CMS Database seeded successfully with initial pages, services, industries, and system parameters.',
      ipAddress: '127.0.0.1',
    },
  });

  console.log('✅ CMS Database Seeding Complete!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
