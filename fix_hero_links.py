import os

dir_path = '/Users/dineshpabbathi/Desktop/precision'
home_path = os.path.join(dir_path, 'home.html')

with open(home_path, 'r') as f:
    content = f.read()

# Replace Our Services link
content = content.replace('<a href="#services" class="btn btn-primary">', '<a href="services.html" class="btn btn-primary">')

# Replace Book a Consultation link
content = content.replace('<a href="#contact" class="btn btn-outline btn-outline--dark">', '<a href="contact.html" class="btn btn-outline btn-outline--dark">')

with open(home_path, 'w') as f:
    f.write(content)

print("Fixed hero links in home.html")
