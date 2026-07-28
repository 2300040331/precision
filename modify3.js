const fs = require('fs');

const servicesFiles = [
    'services-audit.html',
    'services-consulting.html',
    'services-risk.html',
    'services-tax.html',
    'services-vcfo.html'
];

for (const filename of servicesFiles) {
    if (!fs.existsSync(filename)) continue;
    
    let content = fs.readFileSync(filename, 'utf8');

    const approachStart = content.indexOf('<!-- 5 OUR APPROACH -->');
    if (approachStart === -1) continue;

    const endOfApproachSection = content.indexOf('</section>', approachStart);
    const approachEndIndex = endOfApproachSection + 10; // length of </section>
    
    const mainEndIndex = content.indexOf('</main>');

    if (approachEndIndex !== -1 && mainEndIndex !== -1 && mainEndIndex > approachEndIndex) {
        const toKeepBefore = content.substring(0, approachEndIndex);
        const toKeepAfter = content.substring(mainEndIndex);
        content = toKeepBefore + '\n' + toKeepAfter;
        fs.writeFileSync(filename, content, 'utf8');
        console.log(`Updated ${filename}`);
    } else {
        console.log(`Could not process ${filename}`);
    }
}
