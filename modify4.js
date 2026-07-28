const fs = require('fs');
const path = require('path');

const dir = '/Users/dineshpabbathi/Desktop/precision';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');

const indexHtml = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

// Extract nav block
const navStart = indexHtml.indexOf('<nav class="navbar__nav"');
const navEnd = indexHtml.indexOf('</nav>', navStart) + 6;
const correctNav = indexHtml.substring(navStart, navEnd);

if (navStart === -1 || navEnd < 6) {
    console.error("Could not find nav in index.html");
    process.exit(1);
}

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const fileNavStart = content.indexOf('<nav class="navbar__nav"');
    const fileNavEnd = content.indexOf('</nav>', fileNavStart) + 6;
    
    if (fileNavStart !== -1 && fileNavEnd > 5) {
        content = content.substring(0, fileNavStart) + correctNav + content.substring(fileNavEnd);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated nav in ${file}`);
    } else {
        console.log(`Nav not found in ${file}`);
    }
}
