import os
import glob
import re

dir_path = '/Users/dineshpabbathi/Desktop/precision'

# 1. Read home.html
index_path = os.path.join(dir_path, 'home.html')
with open(index_path, 'r') as f:
    index_content = f.read()

# 2. Extract the experts section
experts_start = index_content.find('<!-- OUR EXPERTS SECTION')
if experts_start != -1:
    # Find the end of the section (assume the next section or footer)
    experts_end = index_content.find('</section>', experts_start) + 10
    
    experts_html = index_content[experts_start:experts_end]
    
    # Remove from home.html
    new_index_content = index_content[:experts_start] + index_content[experts_end:]
    with open(index_path, 'w') as f:
        f.write(new_index_content)
    
    # Create experts.html
    # Find the start and end of <main>
    main_start = index_content.find('<main>') + 6
    main_end = index_content.find('</main>')
    
    # Create experts.html content
    experts_page_content = index_content[:main_start] + '\n' + experts_html + '\n' + index_content[main_end:]
    
    # Update <title> in experts.html
    experts_page_content = re.sub(r'<title>.*?</title>', '<title>Our Experts | Precision & Co</title>', experts_page_content)
    
    experts_path = os.path.join(dir_path, 'experts.html')
    with open(experts_path, 'w') as f:
        f.write(experts_page_content)
    print("Created experts.html and removed section from home.html")

# 3. Update navbar links in all HTML files
html_files = glob.glob(os.path.join(dir_path, '*.html'))
for filepath in html_files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Update href="#founders" to href="experts.html"
    new_content = content.replace('href="#founders"', 'href="experts.html"')
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated links in {os.path.basename(filepath)}")

