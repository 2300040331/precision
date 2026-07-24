import re

# 1. Get header from index.html
with open('index.html', 'r') as f:
    index_html = f.read()

start_idx = index_html.find('<header class="navbar" id="navbar">')
end_idx = index_html.find('</header>') + len('</header>')
if start_idx == -1 or end_idx == -1:
    print("Could not find header in index.html")
    exit(1)

header_content = index_html[start_idx:end_idx]

# 2. Update HTML files
files_to_update = ['services.html', 'why-choose-us.html', 'industries.html']

for filename in files_to_update:
    try:
        with open(filename, 'r') as f:
            content = f.read()
        
        # We assume they have <header ...>...</header>
        start = content.find('<header ')
        if start == -1:
            print(f"Could not find header start in {filename}")
            continue
        end = content.find('</header>') + len('</header>')
        
        new_content = content[:start] + header_content + content[end:]
        with open(filename, 'w') as f:
            f.write(new_content)
        print(f"Updated {filename}")
    except FileNotFoundError:
        print(f"{filename} not found")

# 3. Update new_generate.py
with open('new_generate.py', 'r') as f:
    gen_content = f.read()

start_gen = gen_content.find('<header ')
end_gen = gen_content.find('</header>') + len('</header>')

if start_gen != -1 and end_gen != -1:
    new_gen_content = gen_content[:start_gen] + header_content + gen_content[end_gen:]
    with open('new_generate.py', 'w') as f:
        f.write(new_gen_content)
    print("Updated new_generate.py")
else:
    print("Could not find header in new_generate.py")
