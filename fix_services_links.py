import os
import glob
import re

dir_path = '/Users/dineshpabbathi/Desktop/precision'
html_files = glob.glob(os.path.join(dir_path, '*.html'))

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()

    # Replace # in mega menu items with services.html
    # This targets the specific missing service pages
    missing_services = [
        "Accounting & Bookkeeping",
        "Company Law & ROC",
        "Startup Advisory",
        "Regulatory Compliance",
        "Transaction Advisory",
        "Valuation",
        "Wealth Advisory"
    ]
    
    for svc in missing_services:
        pattern = r'<a href="#" class="mega-menu__item">' + re.escape(svc) + r'</a>'
        replacement = r'<a href="services.html" class="mega-menu__item">' + svc + r'</a>'
        content = re.sub(pattern, replacement, content)
        
    with open(file, 'w') as f:
        f.write(content)

# Also fix the services.html hub cards
services_path = os.path.join(dir_path, 'services.html')
if os.path.exists(services_path):
    with open(services_path, 'r') as f:
        svc_content = f.read()
    
    # Replace # with contact.html for the hub cards that don't have pages? 
    # Or just services.html? Let's use contact.html for the hub cards so they can inquire.
    # The mega menu goes to services.html, and from services.html they can go to contact.
    svc_content = re.sub(r'<a href="#" class="service-hub-card', r'<a href="contact.html" class="service-hub-card', svc_content)
    
    with open(services_path, 'w') as f:
        f.write(svc_content)

print("Fixed service links.")
