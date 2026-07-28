import os
import re

dir_path = '/Users/dineshpabbathi/Desktop/precision'

# 1. Edit home.html
home_path = os.path.join(dir_path, 'home.html')
with open(home_path, 'r') as f:
    content = f.read()

# We need to remove all the remaining stats-bar__stat blocks until the closing </div> of stats-bar__inner
# Let's look at the current HTML structure from line 196:
#             </div> <!-- end of stats-bar__values -->
#             
#             
#                 <div class="stats-bar__stat reveal-up stagger-2">
# ...
#             </div> <!-- end of stats-bar__inner -->

# I will find the exact string that needs to be removed.
# Let's use a simpler regex that matches <div class="stats-bar__stat.*?>.*?</div> repeatedly.

pattern = r'<div class="stats-bar__stat.*?</div>\s*'
content = re.sub(pattern, '', content, flags=re.DOTALL)

with open(home_path, 'w') as f:
    f.write(content)

print("Removed remaining stats blocks.")
