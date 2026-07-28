import os
import re

dir_path = '/Users/dineshpabbathi/Desktop/precision'
home_path = os.path.join(dir_path, 'home.html')

with open(home_path, 'r') as f:
    content = f.read()

# Define the mapping of service titles to their respective HTML pages
replacements = [
    ("Audit & Assurance", "services-audit.html"),
    ("Tax Advisory", "services-tax.html"),
    ("Business Consulting", "services-consulting.html"),
    ("Risk & Compliance", "services-risk.html"),
    ("GST Services", "services-gst.html"),
    ("Virtual CFO", "services-vcfo.html")
]

# The structure is:
# <h3 class="service-card__title">Audit & Assurance</h3>
# <p class="service-card__text">...</p>
# <a href="#" class="service-card__link">

for title, url in replacements:
    # We want to replace the href="#" that immediately follows the specific title.
    # We can use a regex to find the title, skip the <p> tag, and then replace the href="#" in the <a> tag.
    
    # regex pattern to match the title and the following <a> tag with href="#"
    pattern = r'(<h3 class="service-card__title">' + re.escape(title) + r'</h3>\s*<p class="service-card__text">.*?</p>\s*<a href=")(")( class="service-card__link">)'
    
    # We replace the second group (which is just "#" or empty if I use a different regex)
    # Wait, the current href is href="#"
    pattern = r'(<h3 class="service-card__title">' + re.escape(title) + r'</h3>\s*<p class="service-card__text">.*?</p>\s*<a href=")#[^"]*(" class="service-card__link">)'
    
    replacement = r'\g<1>' + url + r'\g<2>'
    
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(home_path, 'w') as f:
    f.write(content)

print("Updated links in home.html")
