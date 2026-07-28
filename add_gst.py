import os
import glob

dir_path = '/Users/dineshpabbathi/Desktop/precision'
html_files = glob.glob(os.path.join(dir_path, '*.html'))

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()

    # We want to add `<a href="services-tax.html" class="mega-menu__item">GST Services</a>` 
    # to the mega menu list, perhaps right after Taxation.
    
    # We find: `<a href="services-tax.html" class="mega-menu__item" style="padding-bottom: 0;">Taxation</a>`
    # and we also have the submenu stuff. Wait, if we just want it as a regular item, maybe it's better to just append it to the first column or something.
    # Let's just find the Taxation link and add GST Services after it, but wait, Taxation has a submenu.
    # Let's search for how the mega menu is structured.
    
    # Actually, a simple string replace:
    # Find: <a href="services-tax.html" class="mega-menu__item" style="padding-bottom: 0;">Taxation</a>
    # If the user wants GST Services as a separate item, let's remove the submenu under Taxation, and just add GST Services as a regular item.
    
    if "GST Services" not in content:
        # Instead of parsing the complex submenu, let's just add it before Business Advisory
        target_str = '<a href="services-consulting.html" class="mega-menu__item">Business Advisory</a>'
        new_str = '<a href="services-tax.html" class="mega-menu__item">GST Services</a>\n                                            ' + target_str
        content = content.replace(target_str, new_str)
        
        # Also clean up the Taxation one if it has a submenu, but let's just leave it if it works, or maybe the user just didn't see the submenu on mobile.
        
        with open(file, 'w') as f:
            f.write(content)

# Update services.html grid
services_path = os.path.join(dir_path, 'services.html')
if os.path.exists(services_path):
    with open(services_path, 'r') as f:
        svc_content = f.read()
        
    if "<h3>GST Services</h3>" not in svc_content:
        # Find Taxation card and insert GST Services card after it
        target_card = '''                <a href="services-tax.html" class="service-hub-card glass-panel reveal-up stagger-2">
                    <h3>Taxation</h3>
                    <p>Direct Tax and GST & Indirect Tax solutions.</p>
                    <span class="hub-card-arrow">→</span>
                </a>'''
        
        new_card = target_card + '''
                <a href="services-tax.html" class="service-hub-card glass-panel reveal-up stagger-2">
                    <h3>GST Services</h3>
                    <p>Comprehensive GST registration, filing, and advisory.</p>
                    <span class="hub-card-arrow">→</span>
                </a>'''
                
        svc_content = svc_content.replace(target_card, new_card)
        
        with open(services_path, 'w') as f:
            f.write(svc_content)

print("Added GST Services to mega menu and services.html")
