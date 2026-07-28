import re

home_path = '/Users/dineshpabbathi/Desktop/precision/home.html'
with open(home_path, 'r') as f:
    content = f.read()

# Fix the broken markup
def fix_broken_tag(title, url, text):
    # Find the broken `\ onclick="..." style="...">` and the title
    # And replace it with `<div class="industry-card" onclick="..." style="cursor:pointer;">`
    # Note: we lost the `reveal-up stagger-x` classes, but we can restore them or just omit them.
    # Actually, they might be somewhat important for animations, but missing them is better than broken HTML.
    # Let's restore them by matching the broken string.
    pattern = r'\\ onclick="window\.location\.href=\'' + re.escape(url) + r'\';" style="cursor:pointer;">\s*<div class="industry-card__icon">.*?<h4 class="industry-card__title">' + re.escape(title) + r'</h4>'
    
    # We can just use `<div class="industry-card" onclick="..." style="cursor:pointer;">`
    def replacer(match):
        return match.group(0).replace(r'\ onclick=', '<div class="industry-card" onclick=')
        
    return re.sub(pattern, replacer, text, flags=re.DOTALL)

content = fix_broken_tag('Banking & Finance', 'industry-banking-finance.html', content)
content = fix_broken_tag('Healthcare', 'industry-healthcare.html', content)
content = fix_broken_tag('Technology & IT', 'industry-technology.html', content)
content = fix_broken_tag('Manufacturing', 'industry-manufacturing.html', content)
content = fix_broken_tag('Real Estate', 'industry-real-estate.html', content)
content = fix_broken_tag('Government & PSU', 'industry-government.html', content)

with open(home_path, 'w') as f:
    f.write(content)

print("Fixed broken tags in home.html")
