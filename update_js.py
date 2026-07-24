import re

with open('script.js', 'r') as f:
    content = f.read()

# Pattern for old scroll spy
old_spy_pattern = re.compile(
    r"// ═══════════════════════════════════════════════════════════\n"
    r"  // SERVICES PAGE - SCROLL SPY & STICKY NAV\n"
    r"  // ═══════════════════════════════════════════════════════════\n"
    r".*?(?=// ═══════════════════════════════════════════════════════════\n"
    r"  // INTERACTIVE ACCORDIONS)", re.DOTALL)

new_animation_code = """// ═══════════════════════════════════════════════════════════
  // UNIQUE SERVICE PAGE ANIMATIONS
  // ═══════════════════════════════════════════════════════════
  
  // Audit Page Animations
  const auditGrid = document.getElementById('audit-grid');
  if (auditGrid) {
    const cards = auditGrid.querySelectorAll('.audit-card');
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('animate'), 100 * i);
    });
    
    setTimeout(() => {
      const line = document.getElementById('audit-timeline-line');
      if(line) line.classList.add('animate');
      
      const steps = document.querySelectorAll('.audit-step');
      steps.forEach((step, i) => {
        setTimeout(() => step.classList.add('animate'), 300 * i);
      });
    }, 600);
  }

  // Tax Page Animations
  const taxNodes = document.getElementById('tax-nodes');
  if (taxNodes) {
    const nodes = taxNodes.querySelectorAll('.tax-node');
    nodes.forEach((node, i) => {
      setTimeout(() => node.classList.add('animate'), 200 * i);
    });
  }

  // Consulting Page Animations
  const consultingBento = document.getElementById('consulting-bento');
  if (consultingBento) {
    const boxes = consultingBento.querySelectorAll('.consulting-box');
    boxes.forEach((box, i) => {
      setTimeout(() => box.classList.add('animate'), 300 * i);
    });
  }

  // Risk Page Animations
  const riskGrid = document.getElementById('risk-grid');
  if (riskGrid) {
    const cards = riskGrid.querySelectorAll('.risk-card');
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('animate'), 150 * i);
    });
  }

  // VCFO Page Animations
  const vcfoDash = document.getElementById('vcfo-dash');
  if (vcfoDash) {
    setTimeout(() => {
      vcfoDash.classList.add('animate');
      const path = document.getElementById('vcfo-chart-path');
      if (path) path.classList.add('animate');
    }, 300);
  }

  """

new_content = old_spy_pattern.sub(new_animation_code, content)

with open('script.js', 'w') as f:
    f.write(new_content)

print("script.js updated")
