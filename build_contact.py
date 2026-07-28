import os
import re

dir_path = '/Users/dineshpabbathi/Desktop/precision'

home_path = os.path.join(dir_path, 'home.html')
with open(home_path, 'r') as f:
    home_html = f.read()

# Extract parts
head_match = re.search(r'<head>.*?</head>', home_html, re.DOTALL)
nav_match = re.search(r'<header class="navbar".*?</header>', home_html, re.DOTALL)

# Extract footer and scripts
footer_split = home_html.split('<footer class="footer"')
footer_html = '<footer class="footer"' + footer_split[1]

# We also need the Royal CTA that we injected earlier. Let's just extract it.
royal_cta_match = re.search(r'<section class="royal-cta">.*?</section>', footer_split[0], re.DOTALL)
royal_cta_html = royal_cta_match.group(0) if royal_cta_match else ""

head_content = head_match.group(0)
# Add contact.css to head
head_content = head_content.replace('</head>', '    <link rel="stylesheet" href="contact.css">\n</head>')
head_content = re.sub(r'<title>.*?</title>', '<title>Contact Us | Precision & Co</title>', head_content)

nav_content = nav_match.group(0)

# Build Contact Main Content
contact_content = f"""
    <main>
        <!-- Hero Banner -->
        <section class="contact-hero">
            <div class="contact-hero__bg" style="background-image: url('https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=2000&auto=format&fit=crop');"></div>
            <div class="contact-hero__overlay"></div>
            <div class="contact-hero__content">
                <h1 class="contact-hero__title gsap-fade-up">Contact Us</h1>
                <p class="contact-hero__subtitle gsap-fade-up" style="animation-delay: 0.2s">Connect with our experts to discuss your financial strategy and compliance needs.</p>
            </div>
        </section>

        <!-- Info | Form -->
        <section class="contact-section light-bg">
            <div class="container contact-grid">
                <!-- Left: Info -->
                <div class="contact-info gsap-fade-right">
                    <h2 class="contact-heading">Get in Touch</h2>
                    <p class="contact-text">Reach out to our Bengaluru headquarters for comprehensive financial advisory and auditing services.</p>
                    
                    <div class="contact-details">
                        <div class="contact-detail-item">
                            <div class="icon-box">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            </div>
                            <div>
                                <h4>Phone</h4>
                                <p>+91 98765 43210</p>
                                <p>+91 80 4567 8900</p>
                            </div>
                        </div>

                        <div class="contact-detail-item">
                            <div class="icon-box">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            </div>
                            <div>
                                <h4>Email</h4>
                                <p>info@precisionandco.com</p>
                                <p>advisory@precisionandco.com</p>
                            </div>
                        </div>

                        <div class="contact-detail-item">
                            <div class="icon-box">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            </div>
                            <div>
                                <h4>Headquarters</h4>
                                <p>14th Floor, Prestige Tower,<br>MG Road, Bengaluru 560001</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right: Form -->
                <div class="contact-form-wrap gsap-fade-left">
                    <form class="luxury-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="name">Full Name</label>
                                <input type="text" id="name" placeholder="John Doe">
                            </div>
                            <div class="form-group">
                                <label for="phone">Phone Number</label>
                                <input type="tel" id="phone" placeholder="+91 98765 43210">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" placeholder="john@company.com">
                        </div>
                        <div class="form-group">
                            <label for="service">Service of Interest</label>
                            <select id="service">
                                <option value="audit">Audit & Assurance</option>
                                <option value="tax">Tax Compliance</option>
                                <option value="advisory">Strategic Advisory</option>
                                <option value="mna">M&A Due Diligence</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="message">Your Message</label>
                            <textarea id="message" rows="4" placeholder="Briefly describe your requirements..."></textarea>
                        </div>
                        <button type="button" class="btn btn--gold form-submit-btn">Send Message</button>
                    </form>
                </div>
            </div>
        </section>

        <!-- Hours | Map -->
        <section class="contact-section dark-bg">
            <div class="container contact-grid align-center">
                <!-- Left: Hours -->
                <div class="contact-hours gsap-fade-up">
                    <h2 class="contact-heading gold-text">Business Hours</h2>
                    <ul class="hours-list">
                        <li><span>Monday - Friday</span> <span>9:00 AM - 6:00 PM</span></li>
                        <li><span>Saturday</span> <span>10:00 AM - 2:00 PM (By Appt)</span></li>
                        <li><span>Sunday</span> <span>Closed</span></li>
                    </ul>
                    <p class="hours-note">* We offer flexible timing for international clients across different time zones.</p>
                </div>

                <!-- Right: Map -->
                <div class="contact-map gsap-fade-up">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15552.12874136209!2d77.59560411855468!3d12.976863004381832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1671c6c51ba7%3A0x6bfa58a69a473188!2sMG%20Road%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                        width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
            </div>
        </section>

        <!-- Why Contact Us (Feature Cards) -->
        <section class="contact-features section-padding">
            <div class="container">
                <h2 class="section-title text-center gsap-fade-up">Why Partner With Us</h2>
                <div class="features-grid">
                    <div class="feature-card gsap-fade-up">
                        <h3 class="feature-card__title">Strategic Advisory</h3>
                        <p class="feature-card__text">Tailored guidance for sustainable business growth and market expansion.</p>
                    </div>
                    <div class="feature-card gsap-fade-up" style="animation-delay: 0.1s">
                        <h3 class="feature-card__title">Tax & Compliance</h3>
                        <p class="feature-card__text">Navigating complex local and international regulatory landscapes.</p>
                    </div>
                    <div class="feature-card gsap-fade-up" style="animation-delay: 0.2s">
                        <h3 class="feature-card__title">Audit & Assurance</h3>
                        <p class="feature-card__text">Maintaining the highest standards of financial integrity and transparency.</p>
                    </div>
                    <div class="feature-card gsap-fade-up" style="animation-delay: 0.3s">
                        <h3 class="feature-card__title">M&A Due Diligence</h3>
                        <p class="feature-card__text">Expert valuation and risk assessment for complex transactions.</p>
                    </div>
                </div>
            </div>
        </section>

        {royal_cta_html}
    </main>
"""

full_html = f"""<!DOCTYPE html>
<html lang="en">
{head_content}
<body>
    {nav_content}
    
    {contact_content}

    {footer_html}
</body>
</html>
"""

contact_path = os.path.join(dir_path, 'contact.html')
with open(contact_path, 'w') as f:
    f.write(full_html)

print("contact.html generated successfully.")
