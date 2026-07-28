const fs = require('fs');
const path = require('path');

const dir = '/Users/dineshpabbathi/Desktop/precision';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace logo href
    content = content.replace(/href="#" class="navbar__logo"/g, 'href="index.html" class="navbar__logo"');
    
    // Rename Meet our founders to Our experts
    content = content.replace(/>Meet our founders</g, '>Our experts<');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
}
