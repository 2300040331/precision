import os
import re

dir_path = '/Users/dineshpabbathi/Desktop/precision'

# 1. Edit home.html
home_path = os.path.join(dir_path, 'home.html')
with open(home_path, 'r') as f:
    content = f.read()

# Remove divider and numbers
# We can use regex to remove everything from <div class="stats-bar__divider"> to the end of <div class="stats-bar__numbers"> ... </div>
pattern = r'<div class="stats-bar__divider"></div>\s*<div class="stats-bar__numbers">.*?</div>\s*</div>'
# Wait, the structure is:
# <div class="stats-bar__divider"></div>
# <div class="stats-bar__numbers">
# ...
# </div>
# </div> <!-- end of stats-bar__inner -->

# Let's match more precisely
pattern = r'<div class="stats-bar__divider"></div>\s*<div class="stats-bar__numbers">.*?</div>'
content = re.sub(pattern, '', content, flags=re.DOTALL)

with open(home_path, 'w') as f:
    f.write(content)

# 2. Edit styles.css
styles_path = os.path.join(dir_path, 'styles.css')
with open(styles_path, 'r') as f:
    css = f.read()

# Replace grid-template-columns: 1fr auto 1fr; with grid-template-columns: 1fr; in .stats-bar__inner
css = re.sub(
    r'(\.stats-bar__inner \{[^}]*?)grid-template-columns:\s*1fr\s+auto\s+1fr;',
    r'\1grid-template-columns: 1fr;',
    css,
    flags=re.DOTALL
)

# In mobile styles (if any), there might be grid-template-columns: 1fr; already, but let's just make sure.

with open(styles_path, 'w') as f:
    f.write(css)

print("Removed stats numbers and updated CSS layout.")
