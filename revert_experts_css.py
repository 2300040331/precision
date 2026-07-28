import os
import re

dir_path = '/Users/dineshpabbathi/Desktop/precision'
css_path = os.path.join(dir_path, 'founders.css')

with open(css_path, 'r') as f:
    css = f.read()

replacement_css = """/* ── Premium Golden Image Boxes ── */
.founder-card {
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column;
}

.fcard-img-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    margin-bottom: 40px;
    background-color: var(--f-offwhite);
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    transition: box-shadow var(--f-transition), transform var(--f-transition);
    border: 1px solid rgba(197, 168, 128, 0.4);
    border-radius: 12px;
}

.fcard-img-wrapper::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    border-radius: 12px;
    border: 3px solid transparent;
    background: linear-gradient(45deg, transparent, rgba(197, 168, 128, 0.9), transparent) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 2;
    pointer-events: none;
}

.founder-card:hover .fcard-img-wrapper {
    box-shadow: 0 20px 50px rgba(197, 168, 128, 0.25);
    transform: translateY(-10px);
}

.founder-card:hover .fcard-img-wrapper::before {
    opacity: 1;
}

.fcard-img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    transition: transform var(--f-transition);
    will-change: transform;
}

.founder-card:hover .fcard-img-wrapper img {
    transform: scale(1.05);
}

.fcard-glass-reflection {
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
    transform: skewX(-25deg);
    transition: none;
    z-index: 2;
    pointer-events: none;
}
.founder-card:hover .fcard-glass-reflection {
    animation: glassShine 1s ease forwards;
}
@keyframes glassShine {
    0% { left: -100%; }
    100% { left: 200%; }
}

.fcard-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.fcard-name {
    font-family: var(--f-font-heading);
    font-size: 1.8rem;
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--f-navy);
}

.fcard-role {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--f-gold);
    margin-bottom: 10px;
    font-weight: 600;
}

.fcard-qual, .fcard-exp {
    font-size: 1rem;
    color: var(--f-text-light);
    margin-bottom: 5px;
}

.fcard-btn {
    margin-top: 30px;
    background: none;
    border: none;
    padding: 0;
    font-family: var(--f-font-body);
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--f-navy);
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

pattern = r'/\* ── Premium Golden Box Cards ── \*/.*?/\* ── Modals ── \*/'
css = re.sub(pattern, replacement_css + '\n\n/* ── Modals ── */', css, flags=re.DOTALL)

with open(css_path, 'w') as f:
    f.write(css)

print("Restored original layout and applied golden box only to images.")
