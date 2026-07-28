import os
import re

dir_path = '/Users/dineshpabbathi/Desktop/precision'
founders_css_path = os.path.join(dir_path, 'founders.css')

with open(founders_css_path, 'r') as f:
    css = f.read()

# Replace the Cards section with a premium golden box design
new_cards_css = """/* ── Premium Golden Box Cards ── */
.founder-card {
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column;
    background: #0a1628;
    border: 1px solid rgba(197, 168, 128, 0.3);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.founder-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    border-radius: 12px;
    border: 2px solid transparent;
    background: linear-gradient(45deg, transparent, rgba(197, 168, 128, 0.8), transparent) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 2;
    pointer-events: none;
}

.founder-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(197, 168, 128, 0.15);
}

.founder-card:hover::before {
    opacity: 1;
}

.fcard-img-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border-bottom: 2px solid rgba(197, 168, 128, 0.5);
    background-color: var(--f-navy);
}

.fcard-img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    transition: transform 0.6s ease;
    display: block;
}

.founder-card:hover .fcard-img-wrapper img {
    transform: scale(1.08);
}

.fcard-info {
    padding: 1.75rem 1.5rem;
    background: #0a1628;
    text-align: center;
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.fcard-name {
    font-family: var(--f-font-heading);
    color: #ffffff;
    font-size: 1.8rem;
    font-weight: 500;
    margin-bottom: 8px;
    transition: color 0.3s ease;
}

.founder-card:hover .fcard-name {
    color: var(--f-gold);
}

.fcard-role {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--f-gold);
    margin-bottom: 10px;
    font-weight: 600;
}

.fcard-qual, .fcard-exp {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.7);
    margin-bottom: 5px;
}

.fcard-btn {
    margin-top: 20px;
    background: none;
    border: none;
    padding: 0;
    font-family: var(--f-font-body);
    font-size: 1rem;
    font-weight: 500;
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    transition: color 0.3s;
}

.fcard-btn .arrow {
    margin-left: 10px;
    transition: transform 0.3s;
}

.founder-card:hover .fcard-btn {
    color: var(--f-gold);
}

.founder-card:hover .fcard-btn .arrow {
    transform: translateX(5px);
}

/* Entry Animation */
.founder-card {
    animation: fadeUpIn 0.8s ease backwards;
}
@keyframes fadeUpIn {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
}
.founders-grid > div:nth-child(1) { animation-delay: 0.1s; }
.founders-grid > div:nth-child(2) { animation-delay: 0.2s; }
.founders-grid > div:nth-child(3) { animation-delay: 0.3s; }
.founders-grid > div:nth-child(4) { animation-delay: 0.4s; }
.founders-grid > div:nth-child(5) { animation-delay: 0.5s; }
.founders-grid > div:nth-child(6) { animation-delay: 0.6s; }

"""

pattern = r'/\* ── Cards ── \*/.*?/\* ── Modals ── \*/'
css = re.sub(pattern, new_cards_css + '\n\n/* ── Modals ── */', css, flags=re.DOTALL)

with open(founders_css_path, 'w') as f:
    f.write(css)

print("Updated founders.css with premium golden boxes and animations.")
