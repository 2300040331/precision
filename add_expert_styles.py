import os

dir_path = '/Users/dineshpabbathi/Desktop/precision'
styles_path = os.path.join(dir_path, 'styles.css')

custom_css = """

/* Enhanced Expert Cards - Golden Box Style */
.founder-card {
    background: #0a1628;
    border: 1px solid rgba(197, 168, 128, 0.3);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    cursor: pointer;
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
    overflow: hidden;
    border-bottom: 2px solid rgba(197, 168, 128, 0.5);
}

.fcard-img-wrapper img {
    transition: transform 0.6s ease, filter 0.6s ease;
    display: block;
    width: 100%;
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
}

.fcard-name {
    color: #ffffff;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    font-family: var(--font-heading), serif;
    transition: color 0.3s ease;
}

.founder-card:hover .fcard-name {
    color: #c5a880;
}

.fcard-role {
    color: #c5a880;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
}

.fcard-qual {
    color: rgba(255,255,255,0.6);
    font-size: 0.9rem;
}

/* Entry Animation for Grid */
.founders-grid-container {
    perspective: 1000px;
}
.founder-card {
    animation: fadeUpIn 0.8s ease backwards;
}
@keyframes fadeUpIn {
    0% { opacity: 0; transform: translateY(30px) rotateX(-10deg); }
    100% { opacity: 1; transform: translateY(0) rotateX(0); }
}
.founders-grid > div:nth-child(1) { animation-delay: 0.1s; }
.founders-grid > div:nth-child(2) { animation-delay: 0.2s; }
.founders-grid > div:nth-child(3) { animation-delay: 0.3s; }
.founders-grid > div:nth-child(4) { animation-delay: 0.4s; }
.founders-grid > div:nth-child(5) { animation-delay: 0.5s; }
.founders-grid > div:nth-child(6) { animation-delay: 0.6s; }

"""

with open(styles_path, 'a') as f:
    f.write(custom_css)

print("Enhanced expert cards with golden box styles and animations appended to styles.css")
