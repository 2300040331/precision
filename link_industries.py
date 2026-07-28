import os
import glob
import re

dir_path = '/Users/dineshpabbathi/Desktop/precision'

# 1. Update mega-menu in ALL html files
html_files = glob.glob(os.path.join(dir_path, '*.html'))

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()

    # Make the Industries mega-menu category a link
    content = content.replace(
        '<div class="mega-menu__category">Industries', 
        '<div class="mega-menu__category" onclick="window.location.href=\'industries.html\';" style="cursor:pointer;">Industries'
    )

    with open(file, 'w') as f:
        f.write(content)

# 2. Update home.html industry cards
home_path = os.path.join(dir_path, 'home.html')
with open(home_path, 'r') as f:
    home_content = f.read()

# Banking & Finance
home_content = re.sub(
    r'(<div class="industry-card[^>]*>)(?=\s*<div class="industry-card__icon">\s*<svg.*?<h4 class="industry-card__title">Banking & Finance</h4>)',
    r'\1', # wait, I need to add onclick
    home_content,
    flags=re.DOTALL
)

# Actually, an easier way is to just do a string replace on the exact opening tags, 
# but they have stagger classes: `reveal-up stagger-1` etc.
# Let's just find them by regex properly.

def add_link_to_card(title, url, text):
    # Find the title, then go backwards to the nearest <div class="industry-card
    # Since regex backward search is hard, we can just find the whole block.
    pattern = r'(<div class="industry-card[^>]*>)\s*(<div class="industry-card__icon">.*?<h4 class="industry-card__title">' + re.escape(title) + r'</h4>)'
    replacement = r'\1'[:-1] + f' onclick="window.location.href=\'{url}\';" style="cursor:pointer;">\n                    \\2'
    return re.sub(pattern, replacement, text, flags=re.DOTALL)

home_content = add_link_to_card('Banking & Finance', 'industry-banking-finance.html', home_content)
home_content = add_link_to_card('Healthcare', 'industry-healthcare.html', home_content)
home_content = add_link_to_card('Technology & IT', 'industry-technology.html', home_content)
home_content = add_link_to_card('Manufacturing', 'industry-manufacturing.html', home_content)
home_content = add_link_to_card('Real Estate', 'industry-real-estate.html', home_content)
home_content = add_link_to_card('Government & PSU', 'industry-government.html', home_content)

with open(home_path, 'w') as f:
    f.write(home_content)

print("Added links to mega-menu and home page industry cards.")
