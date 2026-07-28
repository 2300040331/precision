import os
import re

dir_path = '/Users/dineshpabbathi/Desktop/precision'
css_path = os.path.join(dir_path, 'founders.css')

with open(css_path, 'r') as f:
    css = f.read()

# 1. Update .fcard-info
fcard_info_replacement = """
.fcard-info {
    padding: 30px 24px 40px 24px;
    background: #0a1628;
    text-align: left;
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
"""
css = re.sub(r'\.fcard-info \{.*?\}', fcard_info_replacement.strip(), css, flags=re.DOTALL)

# 2. Update .fcard-name to match original 1.8rem
css = re.sub(r'(\.fcard-name \{[^}]*?)font-size:\s*[^;]*;', r'\1font-size: 1.8rem;', css)

# 3. Update .fcard-role to match original 0.9rem
css = re.sub(r'(\.fcard-role \{[^}]*?)font-size:\s*[^;]*;', r'\1font-size: 0.9rem;', css)

# 4. Update .fcard-qual to match original 1rem
css = re.sub(r'(\.fcard-qual,\s*\.fcard-exp \{[^}]*?)font-size:\s*[^;]*;', r'\1font-size: 1rem;', css)

with open(css_path, 'w') as f:
    f.write(css)

print("Adjusted sizing and alignment in founders.css")
