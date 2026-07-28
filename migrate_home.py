import os
import glob
import re

dir_path = '/Users/dineshpabbathi/Desktop/precision'

# 1. Read home.html
index_path = os.path.join(dir_path, 'home.html')
with open(index_path, 'r') as f:
    index_content = f.read()

# 2. Extract intro overlay HTML
intro_match = re.search(r'<!-- ═══════════════════════════════════════════════════════════ -->\s*<!-- INTRO VIDEO OVERLAY                                         -->.*?</div>', index_content, re.DOTALL)
intro_html = intro_match.group(0) if intro_match else ""

# 3. Create home.html by removing intro overlay and replacing links
home_content = index_content
if intro_html:
    home_content = home_content.replace(intro_html, '')

# Replace all href="home.html" with href="home.html"
home_content = home_content.replace('href="home.html"', 'href="home.html"')

home_path = os.path.join(dir_path, 'home.html')
with open(home_path, 'w') as f:
    f.write(home_content)

# 4. Create new home.html (Intro Page)
# It will have the intro video and then redirect to home.html
new_index_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Precision & Co — Welcome</title>
    <style>
        body, html {{ margin: 0; padding: 0; background: #071827; width: 100vw; height: 100vh; overflow: hidden; }}
        #intro-overlay {{ position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #071827; z-index: 9999; display: flex; align-items: center; justify-content: center; }}
        video {{ width: 100%; height: 100%; object-fit: cover; }}
        #skip-intro-btn {{ position: absolute; bottom: 40px; right: 40px; background: rgba(255, 255, 255, 0.1); color: #C99A3A; border: 1px solid rgba(201, 154, 58, 0.3); padding: 12px 24px; cursor: pointer; border-radius: 4px; font-family: 'DM Sans', sans-serif; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s; z-index: 10000; }}
        #skip-intro-btn:hover {{ background: rgba(201, 154, 58, 0.2); }}
    </style>
</head>
<body>
    <div id="intro-overlay">
        <video id="intro-video" muted playsinline autoplay>
            <source src="assets/precision intro video.mp4" type="video/mp4">
        </video>
        <button id="skip-intro-btn">Skip Intro &rarr;</button>
    </div>
    <script>
        const video = document.getElementById('intro-video');
        const skipBtn = document.getElementById('skip-intro-btn');
        
        const goToHome = () => {{
            window.location.href = 'home.html';
        }};

        video.addEventListener('ended', goToHome);
        skipBtn.addEventListener('click', goToHome);
        
        // Failsafe in case video doesn't play
        setTimeout(() => {{
            if (video.currentTime === 0) goToHome();
        }}, 3000);
    </script>
</body>
</html>
"""

with open(index_path, 'w') as f:
    f.write(new_index_content)

# 5. Update ALL other HTML files to link to home.html instead of home.html
html_files = glob.glob(os.path.join(dir_path, '*.html'))
for file in html_files:
    if file.endswith('home.html'): continue
    
    with open(file, 'r') as f:
        content = f.read()
    
    content = content.replace('href="home.html"', 'href="home.html"')
    
    with open(file, 'w') as f:
        f.write(content)

# 6. Update python generators (create_industries.py, build_industry_detail_pages.py)
python_files = glob.glob(os.path.join(dir_path, '*.py'))
for file in python_files:
    with open(file, 'r') as f:
        content = f.read()
        
    content = content.replace('home.html', 'home.html')
    
    with open(file, 'w') as f:
        f.write(content)

# 7. Update script.js to remove intro logic since it's now handled entirely in home.html
script_path = os.path.join(dir_path, 'script.js')
with open(script_path, 'r') as f:
    script_content = f.read()

# We can use regex to remove the intro video block in script.js
script_content = re.sub(r'// INTRO VIDEO LOGIC.*?// END INTRO VIDEO LOGIC', '', script_content, flags=re.DOTALL)
# Or if it doesn't have an end marker, let's just leave it, it won't break because introOverlay will be null on home.html.

print("Migration to home.html completed successfully.")
