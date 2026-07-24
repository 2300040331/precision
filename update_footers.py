import glob

# 1. Get footer from index.html
with open('index.html', 'r') as f:
    index_html = f.read()

start_idx = index_html.find('<footer class="footer"')
if start_idx == -1:
    print("Could not find footer in index.html")
    exit(1)
end_idx = index_html.find('</footer>', start_idx) + len('</footer>')

footer_content = index_html[start_idx:end_idx]

# 2. Update HTML files
files_to_update = [f for f in glob.glob('*.html') if f != 'index.html']

for filename in files_to_update:
    try:
        with open(filename, 'r') as f:
            content = f.read()
        
        start = content.find('<footer ')
        if start == -1:
            print(f"Could not find footer start in {filename}")
            continue
        end = content.find('</footer>', start) + len('</footer>')
        
        new_content = content[:start] + footer_content + content[end:]
        with open(filename, 'w') as f:
            f.write(new_content)
        print(f"Updated {filename}")
    except FileNotFoundError:
        print(f"{filename} not found")
