const fs = require('fs');
const path = require('path');

const servicesData = {
    'services-audit.html': {
        img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
        inds: [
            { name: 'Financial Services', img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop' },
            { name: 'Manufacturing', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop' },
            { name: 'Retail', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop' }
        ]
    },
    'services-consulting.html': {
        img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
        inds: [
            { name: 'Technology & IT', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop' },
            { name: 'Healthcare', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop' },
            { name: 'Real Estate', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop' }
        ]
    },
    'services-risk.html': {
        img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
        inds: [
            { name: 'Financial Services', img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop' },
            { name: 'Healthcare', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop' },
            { name: 'Technology & IT', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop' }
        ]
    },
    'services-tax.html': {
        img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',
        inds: [
            { name: 'Manufacturing', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop' },
            { name: 'Real Estate', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop' },
            { name: 'Retail', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop' }
        ]
    },
    'services-vcfo.html': {
        img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
        inds: [
            { name: 'Technology & IT', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop' },
            { name: 'Healthcare', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop' },
            { name: 'Retail', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop' }
        ]
    }
};

for (const [filename, data] of Object.entries(servicesData)) {
    if (!fs.existsSync(filename)) continue;
    
    let content = fs.readFileSync(filename, 'utf8');

    // 1. Remove Scope of Services (6)
    content = content.replace(/<!-- 6 SCOPE OF SERVICES -->[\s\S]*?<\/section>/, '');
    
    // 2. Remove Common Challenges (8)
    content = content.replace(/<!-- 8 BUSINESS CHALLENGES -->[\s\S]*?<\/section>/, '');
    
    // 3. Remove Our Solutions (9)
    content = content.replace(/<!-- 9 OUR SOLUTIONS -->[\s\S]*?<\/section>/, '');
    
    // 4. Remove Key Deliverables (10)
    content = content.replace(/<!-- 10 KEY DELIVERABLES -->[\s\S]*?<\/section>/, '');

    // 5. Update Industries We Serve (7)
    const industriesHtml = `
        <!-- 7 INDUSTRIES WE SERVE -->
        <section class="svc-industries section-padding dark-bg">
            <div class="container">
                <h2 class="section-title text-center gsap-fade-up">Industries We Serve</h2>
                <div class="industry-showcase">
                    ${data.inds.map(ind => `
                    <div class="ind-card gsap-stagger" style="background: url('${ind.img}') center/cover no-repeat;">
                        <div class="ind-overlay" style="background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.2));">
                            <h4>${ind.name}</h4>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </section>`;
    content = content.replace(/<!-- 7 INDUSTRIES WE SERVE -->[\s\S]*?<\/section>/, industriesHtml);

    // 6. Fix Hero Section to include an image and make text visible
    // First, extract the title, subtitle, and description from the existing hero
    let title = 'Service';
    let subtitle = '';
    let desc = '';
    const titleMatch = content.match(/<h1 class="svc-hero__title[^>]*>(.*?)<\/h1>/);
    if (titleMatch) title = titleMatch[1];
    const subMatch = content.match(/<h3 class="svc-hero__subtitle[^>]*>(.*?)<\/h3>/);
    if (subMatch) subtitle = subMatch[1];
    const descMatch = content.match(/<p class="svc-hero__desc[^>]*>(.*?)<\/p>/);
    if (descMatch) desc = descMatch[1];

    const heroHtml = `
        <!-- 1 HERO SECTION -->
        <section class="svc-hero" style="background-color: var(--svc-off-white);">
            <div class="container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; padding-top: 40px; padding-bottom: 40px;">
                <div class="svc-hero__content gsap-fade-right">
                    <h1 class="svc-hero__title" style="margin-bottom: 1rem; color: var(--svc-navy);">${title}</h1>
                    <h3 class="svc-hero__subtitle" style="margin-bottom: 1.5rem; color: var(--svc-gold);">${subtitle}</h3>
                    <p class="svc-hero__desc" style="margin-bottom: 2rem; color: var(--svc-gray); font-size: 1.125rem;">${desc}</p>
                    <div class="svc-hero__ctas">
                        <a href="contact.html" class="btn btn-primary">Book Consultation</a>
                        <a href="#overview" class="btn btn-outline" style="margin-left: 1rem;">Learn More</a>
                    </div>
                </div>
                <div class="svc-hero__image gsap-fade-left">
                    <img src="${data.img}" alt="${title}" style="width: 100%; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                </div>
            </div>
        </section>`;
    
    content = content.replace(/<!-- 1 HERO SECTION -->[\s\S]*?<\/section>/, heroHtml);

    fs.writeFileSync(filename, content, 'utf8');
    console.log(`Updated ${filename}`);
}
