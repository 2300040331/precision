import os
import glob
import re

dir_path = '/Users/dineshpabbathi/Desktop/precision'

html_files = glob.glob(os.path.join(dir_path, '*.html'))

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()

    # 1. Update Royal CTA button link
    content = content.replace('href="home.html#contact" class="royal-cta__btn"', 'href="contact.html" class="royal-cta__btn"')
    
    # 2. Update top navbar Book a Consultation button
    content = content.replace('href="contact.html" class="navbar__cta btn btn-primary"', 'href="contact.html" class="navbar__cta btn btn-primary"')
    content = content.replace('href="home.html#contact" class="navbar__cta btn btn-primary"', 'href="contact.html" class="navbar__cta btn btn-primary"')
    
    # 3. Update hero section Book Consultation buttons in services pages
    content = content.replace('href="contact.html" class="btn btn-primary">Book Consultation', 'href="contact.html" class="btn btn-primary">Book Consultation')
    
    # 4. Remove Learn More button next to Book Consultation
    # It might have a style attribute: class="btn btn-outline" style="margin-left: 1rem;"
    content = re.sub(r'<a href="[^"]*"\s*class="btn btn-outline".*?>\s*Learn More\s*</a>', '', content)
    
    # 5. Remove "Read more >" links from service cards (class="cap-link")
    content = re.sub(r'<a href="[^"]*"\s*class="cap-link".*?>\s*Read more.*?</a>', '', content)
    content = re.sub(r'<a href="[^"]*"\s*class="read-more".*?>\s*Read more.*?</a>', '', content)

    with open(file, 'w') as f:
        f.write(content)

# Update the python scripts so future generations are correct
for script_file in ['add_royal_cta.py', 'build_industry_detail_pages.py']:
    script_path = os.path.join(dir_path, script_file)
    if os.path.exists(script_path):
        with open(script_path, 'r') as f:
            script_content = f.read()
        script_content = script_content.replace('home.html#contact', 'contact.html')
        with open(script_path, 'w') as f:
            f.write(script_content)

print("Links and buttons correctly updated and removed.")
