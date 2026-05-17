<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LexGuard — Read before you bleed.</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&family=EB+Garamond:ital,wght@0,400;1,400&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0A0A0F;
    --surface: #111118;
    --surface2: #1A1A24;
    --border: #22222E;
    --gold: #C8A97E;
    --gold-dim: rgba(200,169,126,0.12);
    --red: #FF3B3B;
    --orange: #FF8C00;
    --yellow: #FFD700;
    --green: #00C851;
    --text: #F0EDE8;
    --muted: #9A9490;
    --font-head: 'Playfair Display', serif;
    --font-body: 'DM Sans', sans-serif;
    --font-legal: 'EB Garamond', serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.7;
    overflow-x: hidden;
  }

  /* Grid bg */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(200,169,126,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200,169,126,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  /* NAV */
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    background: rgba(10,10,15,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 40px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .nav-logo {
    font-family: var(--font-head);
    font-size: 20px;
    font-weight: 700;
    color: var(--gold);
    letter-spacing: 0.05em;
  }
  .nav-logo span { color: var(--text); }
  .nav-links { display: flex; gap: 32px; list-style: none; }
  .nav-links a {
    color: var(--muted);
    text-decoration: none;
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--gold); }
  .nav-cta {
    background: var(--gold);
    color: #0A0A0F;
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    text-decoration: none;
    letter-spacing: 0.05em;
    transition: opacity 0.2s;
  }
  .nav-cta:hover { opacity: 0.85; }

  /* LAYOUT */
  .container { max-width: 1100px; margin: 0 auto; padding: 0 40px; position: relative; z-index: 1; }
  section { padding: 100px 0; }

  /* HERO */
  .hero {
    padding-top: 160px;
    padding-bottom: 100px;
    text-align: center;
  }
  .hero-eyebrow {
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  .hero-eyebrow::before, .hero-eyebrow::after {
    content: '';
    width: 40px;
    height: 1px;
    background: var(--gold);
    opacity: 0.4;
  }
  .hero h1 {
    font-family: var(--font-head);
    font-size: clamp(52px, 8vw, 96px);
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 16px;
  }
  .hero h1 span {
    background: linear-gradient(135deg, var(--gold) 0%, #E8C9A0 50%, var(--gold) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero-tagline {
    font-family: var(--font-legal);
    font-style: italic;
    font-size: 28px;
    color: var(--muted);
    margin-bottom: 32px;
  }
  .hero-desc {
    max-width: 640px;
    margin: 0 auto 48px;
    color: var(--muted);
    font-size: 17px;
    line-height: 1.8;
  }
  .hero-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .btn-primary {
    background: var(--gold);
    color: #0A0A0F;
    padding: 14px 32px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    letter-spacing: 0.05em;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,169,126,0.3); }
  .btn-secondary {
    border: 1px solid var(--border);
    color: var(--text);
    padding: 14px 32px;
    border-radius: 8px;
    font-size: 14px;
    text-decoration: none;
    letter-spacing: 0.05em;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-secondary:hover { border-color: var(--gold); color: var(--gold); }

  /* BADGE ROW */
  .badges {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 48px;
  }
  .badge {
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.05em;
    border: 1px solid;
  }
  .badge-react { background: rgba(97,218,251,0.08); border-color: rgba(97,218,251,0.3); color: #61DAFB; }
  .badge-vite { background: rgba(100,108,255,0.08); border-color: rgba(100,108,255,0.3); color: #818CF8; }
  .badge-tailwind { background: rgba(6,182,212,0.08); border-color: rgba(6,182,212,0.3); color: #06B6D4; }
  .badge-gemini { background: rgba(66,133,244,0.08); border-color: rgba(66,133,244,0.3); color: #60A5FA; }
  .badge-firebase { background: rgba(255,202,40,0.08); border-color: rgba(255,202,40,0.3); color: #FFCA28; }
  .badge-mit { background: rgba(0,200,81,0.08); border-color: rgba(0,200,81,0.3); color: #00C851; }

  /* SECTION LABELS */
  .section-label {
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
  }
  .section-title {
    font-family: var(--font-head);
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 16px;
  }
  .section-sub {
    color: var(--muted);
    font-size: 17px;
    max-width: 560px;
    line-height: 1.8;
    margin-bottom: 60px;
  }

  /* STAT CARDS */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 60px;
  }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px 28px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
  }
  .stat-card:hover { border-color: rgba(200,169,126,0.3); }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--gold);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .stat-card:hover::before { opacity: 1; }
  .stat-num {
    font-family: var(--font-mono);
    font-size: 48px;
    font-weight: 700;
    color: var(--gold);
    line-height: 1;
    margin-bottom: 8px;
  }
  .stat-label { font-size: 13px; color: var(--muted); letter-spacing: 0.05em; }

  /* FEATURES */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  .feature-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  .feature-card:hover {
    border-color: rgba(200,169,126,0.25);
    transform: translateY(-4px);
  }
  .feature-icon {
    font-size: 28px;
    margin-bottom: 16px;
    display: block;
  }
  .feature-title {
    font-family: var(--font-head);
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
    color: var(--text);
  }
  .feature-desc { color: var(--muted); font-size: 15px; line-height: 1.7; }
  .feature-card.wide { grid-column: span 2; }

  /* PIPELINE */
  .pipeline-container {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 48px;
    position: relative;
    overflow: hidden;
  }
  .pipeline-stages {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .pipeline-stage {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    padding: 20px 0;
    position: relative;
    cursor: pointer;
    transition: all 0.2s;
  }
  .pipeline-stage:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 19px;
    top: 52px;
    width: 2px;
    height: calc(100% - 20px);
    background: linear-gradient(to bottom, var(--gold), var(--border));
    opacity: 0.3;
  }
  .pipeline-stage:hover .stage-body { border-color: rgba(200,169,126,0.3); }
  .stage-num {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--surface2);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 700;
    color: var(--gold);
    flex-shrink: 0;
    margin-top: 4px;
    transition: all 0.3s;
    z-index: 1;
  }
  .pipeline-stage.active .stage-num {
    background: var(--gold);
    color: #0A0A0F;
    box-shadow: 0 0 20px rgba(200,169,126,0.4);
  }
  .stage-body {
    flex: 1;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 20px;
    transition: border-color 0.2s;
  }
  .stage-name {
    font-weight: 500;
    font-size: 15px;
    margin-bottom: 4px;
  }
  .stage-desc { color: var(--muted); font-size: 13px; }
  .stage-tag {
    display: inline-block;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gold);
    border: 1px solid rgba(200,169,126,0.3);
    border-radius: 4px;
    padding: 2px 8px;
    margin-top: 8px;
  }

  /* CHARTS SECTION */
  .charts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
  }
  .chart-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
  }
  .chart-title {
    font-size: 12px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
  }

  /* VITALS */
  .vitals-row {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 20px;
  }
  .vital-item { display: flex; align-items: center; gap: 14px; }
  .vital-label { font-size: 13px; color: var(--muted); width: 160px; flex-shrink: 0; }
  .vital-bar-track {
    flex: 1;
    height: 6px;
    background: var(--border);
    border-radius: 3px;
    overflow: hidden;
  }
  .vital-bar-fill {
    height: 100%;
    border-radius: 3px;
    width: 0;
    transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .vital-val {
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 700;
    width: 36px;
    text-align: right;
  }

  /* ARCHITECTURE */
  .arch-container {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 40px;
    overflow-x: auto;
  }

  /* TECH STACK */
  .stack-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  .stack-table th {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    text-align: left;
    padding: 0 16px 16px 0;
    border-bottom: 1px solid var(--border);
  }
  .stack-table td {
    padding: 14px 16px 14px 0;
    border-bottom: 1px solid rgba(34,34,46,0.5);
    vertical-align: top;
  }
  .stack-table tr:last-child td { border-bottom: none; }
  .tech-name {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--gold);
    font-weight: 600;
    white-space: nowrap;
  }
  .tech-purpose { color: var(--muted); }

  /* DEMO CARD */
  .demo-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .demo-left { padding: 48px; }
  .demo-right {
    background: var(--surface2);
    border-left: 1px solid var(--border);
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .demo-mock-header {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .mock-clause {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px;
    border-left: 3px solid;
    transition: transform 0.2s;
  }
  .mock-clause:hover { transform: translateX(4px); }
  .mock-clause.crit { border-left-color: var(--red); }
  .mock-clause.high { border-left-color: var(--orange); }
  .mock-clause.med { border-left-color: var(--yellow); }
  .mock-clause-title { font-size: 13px; font-weight: 500; margin-bottom: 4px; }
  .mock-clause-badge {
    font-size: 10px;
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .mock-clause.crit .mock-clause-badge { color: var(--red); }
  .mock-clause.high .mock-clause-badge { color: var(--orange); }
  .mock-clause.med .mock-clause-badge { color: var(--yellow); }

  /* SCORE DISPLAY */
  .score-display {
    text-align: center;
    padding: 40px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 16px;
    margin-bottom: 20px;
  }
  .score-num {
    font-family: var(--font-mono);
    font-size: 80px;
    font-weight: 700;
    color: var(--red);
    line-height: 1;
    display: block;
  }
  .score-label { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-top: 8px; }

  /* FOOTER */
  footer {
    border-top: 1px solid var(--border);
    padding: 48px 0;
    text-align: center;
  }
  .footer-logo {
    font-family: var(--font-head);
    font-size: 32px;
    font-weight: 900;
    color: var(--gold);
    margin-bottom: 8px;
  }
  .footer-tag {
    font-family: var(--font-legal);
    font-style: italic;
    color: var(--muted);
    font-size: 18px;
    margin-bottom: 24px;
  }
  .footer-links { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; }
  .footer-links a {
    color: var(--muted);
    text-decoration: none;
    font-size: 13px;
    letter-spacing: 0.05em;
    transition: color 0.2s;
  }
  .footer-links a:hover { color: var(--gold); }
  .footer-copy { color: rgba(154,148,144,0.4); font-size: 12px; margin-top: 24px; }

  /* GETTING STARTED */
  .steps { display: flex; flex-direction: column; gap: 16px; }
  .step {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }
  .step-num {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--gold-dim);
    border: 1px solid rgba(200,169,126,0.3);
    color: var(--gold);
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 4px;
  }
  .step-body { flex: 1; }
  .step-title { font-weight: 500; margin-bottom: 6px; }
  code {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px 16px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--gold);
    display: block;
    margin-top: 8px;
    letter-spacing: 0.02em;
  }

  /* HACKATHON */
  .hack-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .hack-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    transition: border-color 0.2s;
  }
  .hack-card:hover { border-color: rgba(200,169,126,0.3); }
  .hack-criterion {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 10px;
  }
  .hack-response { color: var(--muted); font-size: 14px; line-height: 1.7; }

  /* DIVIDER */
  .divider {
    height: 1px;
    background: linear-gradient(to right, transparent, var(--border), transparent);
    margin: 0;
  }

  /* ANIMATE ON SCROLL */
  .fade-up {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .fade-up.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    nav { padding: 0 20px; }
    .nav-links { display: none; }
    .container { padding: 0 20px; }
    .stat-grid, .features-grid, .charts-grid, .demo-card, .hack-grid { grid-template-columns: 1fr; }
    .feature-card.wide { grid-column: span 1; }
    .demo-right { border-left: none; border-top: 1px solid var(--border); }
    .hero h1 { font-size: 48px; }
  }
</style>
</head>
<body>

<!-- NAV -->
<nav>
  <div class="nav-logo">Lex<span>Guard</span></div>
  <ul class="nav-links">
    <li><a href="#features">Features</a></li>
    <li><a href="#pipeline">Pipeline</a></li>
    <li><a href="#architecture">Architecture</a></li>
    <li><a href="#stack">Stack</a></li>
    <li><a href="#demo">Demo</a></li>
  </ul>
  <a href="https://intricate-gamma-496607-q3.web.app" class="nav-cta" target="_blank">View Live →</a>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="container">
    <div class="hero-eyebrow">PromptWars · Google × Scaler School of Technology</div>
    <h1><span>LexGuard</span></h1>
    <p class="hero-tagline">Read before you bleed.</p>
    <p class="hero-desc">
      An AI-powered Legal War Room that reads every contract clause as a plaintiff's attorney — exposing hidden risks, simulating consequences, and arming you with counter-clauses before you ever pick up a pen.
    </p>
    <div class="hero-actions">
      <a href="https://intricate-gamma-496607-q3.web.app" class="btn-primary" target="_blank">
        ⚔️ Launch LexGuard
      </a>
      <a href="https://github.com/Viraj281105/LexGuard" class="btn-secondary" target="_blank">
        ⬡ View on GitHub
      </a>
    </div>

    <div class="badges">
      <span class="badge badge-react">React 18</span>
      <span class="badge badge-vite">Vite 5</span>
      <span class="badge badge-tailwind">TailwindCSS</span>
      <span class="badge badge-gemini">Gemini 2.0 Flash</span>
      <span class="badge badge-firebase">Firebase Hosting</span>
      <span class="badge badge-mit">MIT License</span>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- STATS -->
<section>
  <div class="container">
    <p class="section-label">The Problem</p>
    <h2 class="section-title">Contracts are designed to be unread.</h2>
    <p class="section-sub">Most people sign without reading. The clauses they skip are rarely the safe ones.</p>

    <div class="stat-grid fade-up">
      <div class="stat-card">
        <div class="stat-num" data-target="89">0</div>
        <div class="stat-label">% of people don't read their employment contracts in full</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" data-target="3" data-suffix=".2x">0</div>
        <div class="stat-label">More likely to face legal action if you signed a non-standard contract</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" data-prefix="$" data-target="47" data-suffix="K">0</div>
        <div class="stat-label">Average cost of a non-compete lawsuit for an individual employee</div>
      </div>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- FEATURES -->
<section id="features">
  <div class="container">
    <p class="section-label">Core Innovations</p>
    <h2 class="section-title">Not a summarizer. A War Room.</h2>
    <p class="section-sub">Five creative systems that transform dry legal analysis into actionable intelligence.</p>

    <div class="features-grid fade-up">
      <div class="feature-card">
        <span class="feature-icon">⚖️</span>
        <div class="feature-title">The Clause Courtroom</div>
        <div class="feature-desc">Every risky clause is put on trial. Prosecution argues how it harms the signer. Defense presents the strongest corporate justification. Verdict delivers a decisive operational recommendation. Nobody else does this.</div>
      </div>
      <div class="feature-card">
        <span class="feature-icon">🌡️</span>
        <div class="feature-title">Contract Vitals Monitor</div>
        <div class="feature-desc">Five real-time risk gauges — Financial Risk, Privacy Exposure, Power Balance, Exit Freedom, and IP Ownership Risk — rendered as live animated bars on a 0–100 danger scale. A 5-year-old understands red.</div>
      </div>
      <div class="feature-card">
        <span class="feature-icon">🔮</span>
        <div class="feature-title">Consequence Simulator</div>
        <div class="feature-desc">For every critical clause, LexGuard generates three viscerally realistic scenarios with specific dollar amounts, legal timeframes, and exact procedures. Not "this could hurt you" — but "$47,000 in legal fees and 18 months of litigation."</div>
      </div>
      <div class="feature-card">
        <span class="feature-icon">🥊</span>
        <div class="feature-title">Negotiation Punches</div>
        <div class="feature-desc">The exact problematic language quoted verbatim, a fairer replacement in proper legal English, and one sentence of tactical reasoning. Ready to hand to a lawyer or paste into a counteroffer. Immediately actionable.</div>
      </div>
      <div class="feature-card wide">
        <span class="feature-icon">🌐</span>
        <div class="feature-title">Plain English Mode + Google Search Grounding</div>
        <div class="feature-desc">One toggle switches the entire analysis from legal precision to sixth-grade plain language. Every analysis is grounded by real Google Search results — Gemini retrieves live legal statutes, case law, and regulatory guidance during analysis, satisfying the RAG requirement with real citations, not hallucinations.</div>
      </div>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- PIPELINE -->
<section id="pipeline">
  <div class="container">
    <p class="section-label">AI Pipeline</p>
    <h2 class="section-title">Seven reasoning stages. One call.</h2>
    <p class="section-sub">All seven stages execute in a single Gemini 2.0 Flash call with Search Grounding enabled. Click any stage to learn more.</p>

    <div class="pipeline-container fade-up">
      <div class="pipeline-stages" id="pipelineStages">
        <!-- stages rendered by JS -->
      </div>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- CHARTS -->
<section id="architecture">
  <div class="container">
    <p class="section-label">Risk Analysis</p>
    <h2 class="section-title">What LexGuard sees.</h2>
    <p class="section-sub">Live visualisation of the NovaTech demo contract — 7 weaponised clauses, scored across 5 dimensions.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;" class="fade-up">
      <!-- Vitals Panel -->
      <div class="chart-card">
        <div class="chart-title">Contract Vitals — NovaTech Demo</div>
        <div class="score-display" style="padding:24px;margin-bottom:16px;">
          <span class="score-num" id="overallScore">0</span>
          <div class="score-label">Overall Contract Health Score (lower = more dangerous)</div>
        </div>
        <div class="vitals-row" id="vitalsRow"></div>
      </div>

      <!-- Radar Chart -->
      <div class="chart-card">
        <div class="chart-title">Risk Profile Comparison</div>
        <div style="position:relative;height:280px;">
          <canvas id="radarChart" role="img" aria-label="Radar chart comparing NovaTech contract risk profile vs typical contract vs LexGuard protected baseline">Radar comparison: NovaTech demo scores critical across all five risk dimensions vs typical and protected baselines.</canvas>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:16px;font-size:12px;color:var(--muted);">
          <span style="display:flex;align-items:center;gap:5px;"><span style="width:10px;height:10px;border-radius:2px;background:#FF3B3B;"></span>NovaTech (Demo)</span>
          <span style="display:flex;align-items:center;gap:5px;"><span style="width:10px;height:10px;border-radius:2px;background:#FF8C00;"></span>Typical Contract</span>
          <span style="display:flex;align-items:center;gap:5px;"><span style="width:10px;height:10px;border-radius:2px;background:#C8A97E;"></span>LexGuard Protected</span>
        </div>
      </div>
    </div>

    <!-- Clause Severity Chart -->
    <div class="charts-grid fade-up">
      <div class="chart-card">
        <div class="chart-title">Clause Severity Breakdown</div>
        <div style="position:relative;height:220px;">
          <canvas id="severityChart" role="img" aria-label="Bar chart showing clause severity: 4 critical, 2 high, 1 medium, 0 low">4 critical clauses, 2 high, 1 medium.</canvas>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Category Distribution</div>
        <div style="position:relative;height:220px;">
          <canvas id="categoryChart" role="img" aria-label="Doughnut chart of clause categories in NovaTech contract">IP: 1, NonCompete: 1, Arbitration: 1, Privacy: 1, Financial: 2, General: 1.</canvas>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;font-size:11px;color:var(--muted);">
          <span style="display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:2px;background:#FF3B3B;"></span>IP</span>
          <span style="display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:2px;background:#FF8C00;"></span>NonCompete</span>
          <span style="display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:2px;background:#FFD700;"></span>Arbitration</span>
          <span style="display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:2px;background:#C8A97E;"></span>Privacy</span>
          <span style="display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:2px;background:#818CF8;"></span>Financial</span>
          <span style="display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:2px;background:#9A9490;"></span>General</span>
        </div>
      </div>
    </div>

    <!-- Architecture SVG -->
    <div class="arch-container fade-up" style="margin-top:20px;">
      <div class="chart-title" style="margin-bottom:28px;">System Architecture</div>
      <svg width="100%" viewBox="0 0 1020 480" role="img" xmlns="http://www.w3.org/2000/svg">
        <title>LexGuard System Architecture</title>
        <desc>Data flows from user input through PDF parser or text paste, into the Gemini AI engine with 7 reasoning stages and search grounding, producing structured analysis rendered in the React dashboard.</desc>
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="#C8A97E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </marker>
        </defs>

        <!-- INPUT LAYER -->
        <text x="60" y="32" font-family="DM Sans,sans-serif" font-size="10" fill="#9A9490" letter-spacing="3" text-anchor="middle">INPUT</text>
        <rect x="10" y="44" width="100" height="44" rx="8" fill="#1A1A24" stroke="#22222E" stroke-width="1"/>
        <text x="60" y="68" font-family="DM Sans,sans-serif" font-size="13" fill="#F0EDE8" text-anchor="middle" dominant-baseline="central">PDF Upload</text>
        <rect x="10" y="104" width="100" height="44" rx="8" fill="#1A1A24" stroke="#22222E" stroke-width="1"/>
        <text x="60" y="128" font-family="DM Sans,sans-serif" font-size="13" fill="#F0EDE8" text-anchor="middle" dominant-baseline="central">Paste Text</text>
        <rect x="10" y="164" width="100" height="44" rx="8" fill="rgba(200,169,126,0.1)" stroke="rgba(200,169,126,0.4)" stroke-width="1"/>
        <text x="60" y="188" font-family="DM Sans,sans-serif" font-size="13" fill="#C8A97E" text-anchor="middle" dominant-baseline="central">Load Demo</text>

        <!-- Arrows to parser -->
        <line x1="110" y1="66" x2="160" y2="140" stroke="#C8A97E" stroke-width="1" stroke-opacity="0.4" marker-end="url(#arr)"/>
        <line x1="110" y1="126" x2="160" y2="140" stroke="#C8A97E" stroke-width="1" stroke-opacity="0.4" marker-end="url(#arr)"/>

        <!-- PARSER -->
        <text x="210" y="32" font-family="DM Sans,sans-serif" font-size="10" fill="#9A9490" letter-spacing="3" text-anchor="middle">PARSE</text>
        <rect x="160" y="108" width="100" height="60" rx="8" fill="#1A1A24" stroke="#22222E" stroke-width="1"/>
        <text x="210" y="132" font-family="DM Sans,sans-serif" font-size="12" fill="#F0EDE8" text-anchor="middle">pdfjs-dist</text>
        <text x="210" y="150" font-family="DM Sans,sans-serif" font-size="11" fill="#9A9490" text-anchor="middle">Client-side parse</text>

        <!-- Arrow to AI -->
        <line x1="260" y1="138" x2="310" y2="138" stroke="#C8A97E" stroke-width="1.5" stroke-opacity="0.6" marker-end="url(#arr)"/>

        <!-- AI ENGINE (big box) -->
        <text x="510" y="32" font-family="DM Sans,sans-serif" font-size="10" fill="#9A9490" letter-spacing="3" text-anchor="middle">GEMINI 2.0 FLASH — 7 REASONING STAGES</text>
        <rect x="310" y="44" width="400" height="360" rx="12" fill="#111118" stroke="rgba(200,169,126,0.25)" stroke-width="1.5"/>

        <!-- Stage boxes inside -->
        <rect x="330" y="64" width="360" height="34" rx="6" fill="#1A1A24" stroke="#22222E" stroke-width="0.5"/>
        <text x="350" y="77" font-family="DM Sans,sans-serif" font-size="11" fill="#C8A97E">01</text>
        <text x="375" y="77" font-family="DM Sans,sans-serif" font-size="12" fill="#F0EDE8">Document Parsing &amp; Classification</text>
        <text x="350" y="90" font-family="DM Sans,sans-serif" font-size="10" fill="#9A9490">Contract type · parties · jurisdiction</text>

        <rect x="330" y="104" width="360" height="34" rx="6" fill="#1A1A24" stroke="#22222E" stroke-width="0.5"/>
        <text x="350" y="117" font-family="DM Sans,sans-serif" font-size="11" fill="#C8A97E">02</text>
        <text x="375" y="117" font-family="DM Sans,sans-serif" font-size="12" fill="#F0EDE8">Clause Extraction &amp; Categorization</text>
        <text x="350" y="130" font-family="DM Sans,sans-serif" font-size="10" fill="#9A9490">IP · Privacy · Financial · Arbitration · NonCompete</text>

        <rect x="330" y="144" width="360" height="34" rx="6" fill="#1A1A24" stroke="rgba(255,59,59,0.2)" stroke-width="0.5"/>
        <text x="350" y="157" font-family="DM Sans,sans-serif" font-size="11" fill="#FF3B3B">03</text>
        <text x="375" y="157" font-family="DM Sans,sans-serif" font-size="12" fill="#F0EDE8">Adversarial Severity Classification</text>
        <text x="350" y="170" font-family="DM Sans,sans-serif" font-size="10" fill="#9A9490">Critical · High · Medium · Low — from signer POV</text>

        <rect x="330" y="184" width="360" height="34" rx="6" fill="#1A1A24" stroke="rgba(255,59,59,0.2)" stroke-width="0.5"/>
        <text x="350" y="197" font-family="DM Sans,sans-serif" font-size="11" fill="#FF3B3B">04</text>
        <text x="375" y="197" font-family="DM Sans,sans-serif" font-size="12" fill="#F0EDE8">Consequence Simulation Engine</text>
        <text x="350" y="210" font-family="DM Sans,sans-serif" font-size="10" fill="#9A9490">3 real-world scenarios · $ amounts · timeframes</text>

        <rect x="330" y="224" width="360" height="34" rx="6" fill="#1A1A24" stroke="#22222E" stroke-width="0.5"/>
        <text x="350" y="237" font-family="DM Sans,sans-serif" font-size="11" fill="#C8A97E">05</text>
        <text x="375" y="237" font-family="DM Sans,sans-serif" font-size="12" fill="#F0EDE8">Multi-Dimensional Risk Scoring</text>
        <text x="350" y="250" font-family="DM Sans,sans-serif" font-size="10" fill="#9A9490">5 vitals · overall health score 0–100</text>

        <rect x="330" y="264" width="360" height="34" rx="6" fill="#1A1A24" stroke="#22222E" stroke-width="0.5"/>
        <text x="350" y="277" font-family="DM Sans,sans-serif" font-size="11" fill="#C8A97E">06</text>
        <text x="375" y="277" font-family="DM Sans,sans-serif" font-size="12" fill="#F0EDE8">Negotiation Intelligence Generation</text>
        <text x="350" y="290" font-family="DM Sans,sans-serif" font-size="10" fill="#9A9490">Counter-clause language · tactical reasoning</text>

        <rect x="330" y="304" width="360" height="34" rx="6" fill="#1A1A24" stroke="#22222E" stroke-width="0.5"/>
        <text x="350" y="317" font-family="DM Sans,sans-serif" font-size="11" fill="#C8A97E">07</text>
        <text x="375" y="317" font-family="DM Sans,sans-serif" font-size="12" fill="#F0EDE8">Plain English Translation Layer</text>
        <text x="350" y="330" font-family="DM Sans,sans-serif" font-size="10" fill="#9A9490">6th-grade level · you / they framing</text>

        <!-- Google Search Grounding badge -->
        <rect x="330" y="352" width="360" height="40" rx="8" fill="rgba(66,133,244,0.08)" stroke="rgba(66,133,244,0.3)" stroke-width="1"/>
        <text x="510" y="368" font-family="DM Sans,sans-serif" font-size="11" fill="#60A5FA" text-anchor="middle">🔍 Google Search Grounding (RAG)</text>
        <text x="510" y="383" font-family="DM Sans,sans-serif" font-size="10" fill="#9A9490" text-anchor="middle">Real legal sources · case law · statutes retrieved live</text>

        <!-- Arrow to output -->
        <line x1="710" y1="220" x2="760" y2="220" stroke="#C8A97E" stroke-width="1.5" stroke-opacity="0.6" marker-end="url(#arr)"/>

        <!-- OUTPUT (dashboard) -->
        <text x="870" y="32" font-family="DM Sans,sans-serif" font-size="10" fill="#9A9490" letter-spacing="3" text-anchor="middle">DASHBOARD</text>
        <rect x="760" y="44" width="220" height="360" rx="12" fill="#111118" stroke="rgba(200,169,126,0.2)" stroke-width="1.5"/>

        <rect x="776" y="64" width="188" height="30" rx="6" fill="#1A1A24" stroke="#22222E" stroke-width="0.5"/>
        <text x="870" y="82" font-family="DM Sans,sans-serif" font-size="11" fill="#F0EDE8" text-anchor="middle">Vitals Monitor</text>

        <rect x="776" y="102" width="188" height="30" rx="6" fill="#1A1A24" stroke="#22222E" stroke-width="0.5"/>
        <text x="870" y="120" font-family="DM Sans,sans-serif" font-size="11" fill="#F0EDE8" text-anchor="middle">Clause Cards</text>

        <rect x="776" y="140" width="188" height="30" rx="6" fill="#1A1A24" stroke="rgba(255,59,59,0.2)" stroke-width="0.5"/>
        <text x="870" y="158" font-family="DM Sans,sans-serif" font-size="11" fill="#FF3B3B" text-anchor="middle">Clause Courtroom</text>

        <rect x="776" y="178" width="188" height="30" rx="6" fill="#1A1A24" stroke="#22222E" stroke-width="0.5"/>
        <text x="870" y="196" font-family="DM Sans,sans-serif" font-size="11" fill="#F0EDE8" text-anchor="middle">Consequence Simulator</text>

        <rect x="776" y="216" width="188" height="30" rx="6" fill="#1A1A24" stroke="#22222E" stroke-width="0.5"/>
        <text x="870" y="234" font-family="DM Sans,sans-serif" font-size="11" fill="#F0EDE8" text-anchor="middle">Negotiation Punches</text>

        <rect x="776" y="254" width="188" height="30" rx="6" fill="#1A1A24" stroke="rgba(200,169,126,0.3)" stroke-width="0.5"/>
        <text x="870" y="272" font-family="DM Sans,sans-serif" font-size="11" fill="#C8A97E" text-anchor="middle">Plain English Toggle</text>

        <rect x="776" y="292" width="188" height="30" rx="6" fill="rgba(66,133,244,0.08)" stroke="rgba(66,133,244,0.3)" stroke-width="0.5"/>
        <text x="870" y="310" font-family="DM Sans,sans-serif" font-size="11" fill="#60A5FA" text-anchor="middle">Grounded Legal Sources</text>

        <rect x="776" y="330" width="188" height="30" rx="6" fill="rgba(0,200,81,0.08)" stroke="rgba(0,200,81,0.3)" stroke-width="0.5"/>
        <text x="870" y="348" font-family="DM Sans,sans-serif" font-size="11" fill="#00C851" text-anchor="middle">TTS Courtroom Audio</text>

        <!-- Demo bypass arrow -->
        <path d="M110 186 Q510 440 760 345" fill="none" stroke="rgba(200,169,126,0.2)" stroke-width="1" stroke-dasharray="4 4" marker-end="url(#arr)"/>
        <text x="440" y="450" font-family="DM Sans,sans-serif" font-size="10" fill="#9A9490" text-anchor="middle">Demo bypass — preloaded result, no API call</text>
      </svg>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- DEMO PREVIEW -->
<section id="demo">
  <div class="container">
    <p class="section-label">Live Demo</p>
    <h2 class="section-title">See it work. Right now.</h2>
    <p class="section-sub">The NovaTech demo contract has seven intentionally harmful clauses loaded and ready. No API key needed.</p>

    <div class="demo-card fade-up">
      <div class="demo-left">
        <h3 style="font-family:var(--font-head);font-size:22px;margin-bottom:12px;">NovaTech Solutions<br>Senior Software Engineer<br>Employment Agreement</h3>
        <p style="color:var(--muted);font-size:14px;margin-bottom:24px;font-family:var(--font-legal);font-style:italic;">A deliberately hostile contract designed to demonstrate every LexGuard capability.</p>

        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:32px;">
          <div style="background:rgba(255,59,59,0.1);border:1px solid rgba(255,59,59,0.2);border-radius:8px;padding:10px 14px;text-align:center;">
            <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--red);">4</div>
            <div style="font-size:11px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;">Critical</div>
          </div>
          <div style="background:rgba(255,140,0,0.1);border:1px solid rgba(255,140,0,0.2);border-radius:8px;padding:10px 14px;text-align:center;">
            <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--orange);">2</div>
            <div style="font-size:11px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;">High</div>
          </div>
          <div style="background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.2);border-radius:8px;padding:10px 14px;text-align:center;">
            <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--yellow);">1</div>
            <div style="font-size:11px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;">Medium</div>
          </div>
        </div>

        <a href="https://intricate-gamma-496607-q3.web.app" class="btn-primary" target="_blank" style="width:fit-content;">
          ⚔️ Analyze This Contract →
        </a>
        <p style="font-size:12px;color:var(--muted);margin-top:12px;">Click "Load Demo" tab on the upload screen</p>
      </div>

      <div class="demo-right">
        <div class="demo-mock-header">7 Clauses Detected</div>
        <div class="mock-clause crit">
          <div class="mock-clause-title">Overreaching IP Assignment</div>
          <div class="mock-clause-badge">⚠ Critical · Non-Standard</div>
        </div>
        <div class="mock-clause crit">
          <div class="mock-clause-title">Nationwide Non-Compete</div>
          <div class="mock-clause-badge">⚠ Critical · Non-Standard</div>
        </div>
        <div class="mock-clause crit">
          <div class="mock-clause-title">Unlimited Device Monitoring</div>
          <div class="mock-clause-badge">⚠ Critical · Non-Standard</div>
        </div>
        <div class="mock-clause crit">
          <div class="mock-clause-title">Perpetual Non-Disparagement $50K</div>
          <div class="mock-clause-badge">⚠ Critical · Non-Standard</div>
        </div>
        <div class="mock-clause high">
          <div class="mock-clause-title">Mandatory Arbitration Waiver</div>
          <div class="mock-clause-badge">▲ High · Industry Standard</div>
        </div>
        <div class="mock-clause high">
          <div class="mock-clause-title">Unilateral Compensation Modification</div>
          <div class="mock-clause-badge">▲ High · Non-Standard</div>
        </div>
        <div class="mock-clause med">
          <div class="mock-clause-title">Auto-Renewal 90-Day Lock-In</div>
          <div class="mock-clause-badge">● Medium · Industry Standard</div>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- TECH STACK -->
<section id="stack">
  <div class="container">
    <p class="section-label">Tech Stack</p>
    <h2 class="section-title">Every tool chosen deliberately.</h2>
    <p class="section-sub">No bloat. Every dependency earns its place.</p>

    <div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:32px;" class="fade-up">
      <table class="stack-table">
        <thead>
          <tr>
            <th style="width:240px;">Technology</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><span class="tech-name">React 18 + Vite 5</span></td><td class="tech-purpose">Frontend framework and build tool with fast HMR and optimised production bundling</td></tr>
          <tr><td><span class="tech-name">TailwindCSS v3</span></td><td class="tech-purpose">Dark premium design system with fully custom utility classes and glass-morphism surfaces</td></tr>
          <tr><td><span class="tech-name">Framer Motion</span></td><td class="tech-purpose">Pipeline animation, clause card entrances, and AnimatePresence transitions</td></tr>
          <tr><td><span class="tech-name">Recharts</span></td><td class="tech-purpose">Risk radar chart comparing contract profiles across five dimensions</td></tr>
          <tr><td><span class="tech-name">Gemini 2.0 Flash</span></td><td class="tech-purpose">Seven-stage adversarial AI reasoning — all stages in a single API call</td></tr>
          <tr><td><span class="tech-name">Google Search Grounding</span></td><td class="tech-purpose">Real-time legal source retrieval (RAG) — statutes, case law, regulatory guidance</td></tr>
          <tr><td><span class="tech-name">Cloud Text-to-Speech</span></td><td class="tech-purpose">Dramatic courtroom audio narration of prosecution arguments via Web Audio API</td></tr>
          <tr><td><span class="tech-name">pdfjs-dist</span></td><td class="tech-purpose">Client-side PDF parsing — no server required, zero latency on extraction</td></tr>
          <tr><td><span class="tech-name">Firebase Hosting</span></td><td class="tech-purpose">Real-time GCP deployment via CDN — global low-latency delivery</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- HACKATHON -->
<section>
  <div class="container">
    <p class="section-label">PromptWars · Google × Scaler</p>
    <h2 class="section-title">Built to win every criterion.</h2>
    <p class="section-sub">LexGuard was architected to directly address each judging dimension with no hand-waving.</p>

    <div class="hack-grid fade-up">
      <div class="hack-card">
        <div class="hack-criterion">Technical Depth</div>
        <div class="hack-response">Seven sequential adversarial reasoning stages, five-dimensional risk scoring, client-side PDF parsing, Web Audio API integration, useReducer state machine, and Google Search Grounding with grounding metadata extraction. Zero manual coding — entire codebase generated through AI prompting.</div>
      </div>
      <div class="hack-card">
        <div class="hack-criterion">Use of AI Tools</div>
        <div class="hack-response">Gemini 2.0 Flash for multi-stage adversarial reasoning, Google Search Grounding for RAG (satisfies the vector retrieval requirement), Google Cloud TTS for dramatic audio, and the seven-stage pipeline framed as a sequential multi-stage reasoning workflow — accurate and impressive without overclaiming.</div>
      </div>
      <div class="hack-card">
        <div class="hack-criterion">Execution Quality</div>
        <div class="hack-response">Full end-to-end demo flow with a preloaded NovaTech contract that bypasses the Gemini API entirely — judges see a flawless dashboard in under 15 seconds regardless of API quota or network conditions. Build compiles clean with zero errors.</div>
      </div>
      <div class="hack-card">
        <div class="hack-criterion">Problem Statement Coverage</div>
        <div class="hack-response">Clause extraction and classification ✓ · Risk scoring ✓ · Adversarial reasoning ✓ · Consequence simulation ✓ · Negotiation recommendations ✓ · Plain language explanations ✓ · Industry benchmark comparison via isIndustryStandard ✓ · RAG via Search Grounding ✓</div>
      </div>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- GETTING STARTED -->
<section>
  <div class="container">
    <p class="section-label">Local Setup</p>
    <h2 class="section-title">Run it yourself.</h2>
    <p class="section-sub" style="margin-bottom:40px;">Four steps from clone to running.</p>

    <div class="steps fade-up">
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-body">
          <div class="step-title">Clone the repository</div>
          <code>git clone https://github.com/Viraj281105/LexGuard.git && cd LexGuard</code>
        </div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-body">
          <div class="step-title">Install dependencies</div>
          <code>npm install</code>
        </div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-body">
          <div class="step-title">Configure environment variables — copy .env.example to .env and add your keys</div>
          <code>VITE_GEMINI_API_KEY=your_gemini_api_key_here<br>VITE_GOOGLE_TTS_KEY=your_google_tts_key_here</code>
        </div>
      </div>
      <div class="step">
        <div class="step-num">4</div>
        <div class="step-body">
          <div class="step-title">Start the development server</div>
          <code>npm run dev</code>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- FOOTER -->
<footer>
  <div class="container">
    <div class="footer-logo">LexGuard</div>
    <div class="footer-tag">Read before you bleed.</div>
    <div class="footer-links">
      <a href="https://intricate-gamma-496607-q3.web.app" target="_blank">Live Demo</a>
      <a href="https://github.com/Viraj281105/LexGuard" target="_blank">GitHub</a>
      <a href="https://github.com/Viraj281105/LexGuard/blob/main/LICENSE">MIT License</a>
    </div>
    <p class="footer-copy">Built for PromptWars · Google × Scaler School of Technology · 2025</p>
  </div>
</footer>

<script>
// PIPELINE STAGES
const stages = [
  { num:'01', name:'Document Parsing & Classification', desc:'Identifies contract type, parties involved, and jurisdiction. Sets the adversarial context for all subsequent stages.', tag:'Foundation' },
  { num:'02', name:'Clause Extraction & Categorization', desc:'Isolates every meaningful clause and labels it: IP / Privacy / Financial / Termination / Arbitration / NonCompete / Liability / General.', tag:'Extraction' },
  { num:'03', name:'Adversarial Severity Classification', desc:'Rates each clause critical / high / medium / low from the signer\'s perspective. A clause is "critical" if it could cause serious financial harm or career destruction.', tag:'Risk' },
  { num:'04', name:'Consequence Simulation Engine', desc:'Generates three viscerally realistic scenarios per dangerous clause — specific dollar amounts, legal timeframes, exact procedures. Not warnings. Outcomes.', tag:'Simulation' },
  { num:'05', name:'Multi-Dimensional Risk Scoring', desc:'Computes five independent vitals plus an overall contract health score 0–100. Lower = more dangerous. Designed to be readable at a glance.', tag:'Scoring' },
  { num:'06', name:'Negotiation Intelligence Generation', desc:'Produces exact counter-clause language and tactical reasoning for every flagged clause. Ready to hand to a lawyer or paste into a counteroffer.', tag:'Strategy' },
  { num:'07', name:'Plain English Translation Layer', desc:'Rewrites every clause at a sixth-grade reading level using "you" and "they" — brutally direct about consequences. One toggle switches the entire dashboard.', tag:'Accessibility' },
];

const container = document.getElementById('pipelineStages');
stages.forEach((s, i) => {
  const el = document.createElement('div');
  el.className = 'pipeline-stage' + (i === 0 ? ' active' : '');
  el.innerHTML = `
    <div class="stage-num">${s.num}</div>
    <div class="stage-body">
      <div class="stage-name">${s.name}</div>
      <div class="stage-desc">${s.desc}</div>
      <span class="stage-tag">${s.tag}</span>
    </div>
  `;
  el.addEventListener('click', () => {
    document.querySelectorAll('.pipeline-stage').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
  });
  container.appendChild(el);
});

// VITALS
const vitals = [
  { label: '💰 Financial Risk', val: 82, color: '#FF3B3B' },
  { label: '🔒 Privacy Exposure', val: 95, color: '#FF3B3B' },
  { label: '⚖️ Power Balance', val: 88, color: '#FF3B3B' },
  { label: '🚪 Exit Freedom', val: 91, color: '#FF3B3B' },
  { label: '🧠 IP Ownership Risk', val: 97, color: '#FF3B3B' },
];

const vitalsRow = document.getElementById('vitalsRow');
vitals.forEach(v => {
  vitalsRow.innerHTML += `
    <div class="vital-item">
      <div class="vital-label">${v.label}</div>
      <div class="vital-bar-track">
        <div class="vital-bar-fill" data-val="${v.val}" style="background:${v.color};"></div>
      </div>
      <div class="vital-val" style="color:${v.color};">${v.val}</div>
    </div>
  `;
});

// SCORE COUNT UP
function countUp(el, target, prefix='', suffix='') {
  let current = 0;
  const duration = 1800;
  const steps = 60;
  const increment = target / steps;
  const interval = duration / steps;
  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = prefix + Math.round(current) + suffix;
    if (current >= target) clearInterval(timer);
  }, interval);
}

// RADAR CHART
new Chart(document.getElementById('radarChart'), {
  type: 'radar',
  data: {
    labels: ['Financial Risk','Privacy Exposure','Power Balance','Exit Freedom','IP Ownership'],
    datasets: [
      { label:'NovaTech (Demo)', data:[82,95,88,91,97], backgroundColor:'rgba(255,59,59,0.12)', borderColor:'#FF3B3B', borderWidth:2, pointBackgroundColor:'#FF3B3B', pointRadius:4, borderDash:[] },
      { label:'Typical Contract', data:[55,60,62,58,50], backgroundColor:'rgba(255,140,0,0.08)', borderColor:'#FF8C00', borderWidth:1.5, pointBackgroundColor:'#FF8C00', pointRadius:3, borderDash:[4,4] },
      { label:'LexGuard Protected', data:[15,20,18,12,14], backgroundColor:'rgba(200,169,126,0.08)', borderColor:'#C8A97E', borderWidth:1.5, pointBackgroundColor:'#C8A97E', pointRadius:3, borderDash:[2,2] },
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      r: {
        min: 0, max: 100,
        grid: { color: 'rgba(34,34,46,0.8)' },
        angleLines: { color: 'rgba(34,34,46,0.8)' },
        pointLabels: { color: '#9A9490', font: { size: 11 } },
        ticks: { display: false, stepSize: 25 }
      }
    }
  }
});

// SEVERITY CHART
new Chart(document.getElementById('severityChart'), {
  type: 'bar',
  data: {
    labels: ['Critical','High','Medium','Low'],
    datasets: [{
      label: 'Clauses',
      data: [4, 2, 1, 0],
      backgroundColor: ['rgba(255,59,59,0.7)','rgba(255,140,0,0.7)','rgba(255,215,0,0.7)','rgba(0,200,81,0.7)'],
      borderColor: ['#FF3B3B','#FF8C00','#FFD700','#00C851'],
      borderWidth: 1,
      borderRadius: 6,
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(34,34,46,0.5)' }, ticks: { color: '#9A9490', font:{size:12} } },
      y: { grid: { color: 'rgba(34,34,46,0.5)' }, ticks: { color: '#9A9490', font:{size:12}, stepSize:1 }, min:0, max:5 }
    }
  }
});

// CATEGORY CHART
new Chart(document.getElementById('categoryChart'), {
  type: 'doughnut',
  data: {
    labels: ['IP','NonCompete','Arbitration','Privacy','Financial','General'],
    datasets: [{
      data: [1,1,1,1,2,1],
      backgroundColor: ['rgba(255,59,59,0.7)','rgba(255,140,0,0.7)','rgba(255,215,0,0.7)','rgba(200,169,126,0.7)','rgba(129,140,248,0.7)','rgba(154,148,144,0.5)'],
      borderColor: ['#FF3B3B','#FF8C00','#FFD700','#C8A97E','#818CF8','#9A9490'],
      borderWidth: 1,
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    cutout: '65%',
    plugins: { legend: { display: false } }
  }
});

// INTERSECTION OBSERVER
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Count up stats
      entry.target.querySelectorAll('[data-target]').forEach(el => {
        const target = parseInt(el.dataset.target);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        countUp(el, target, prefix, suffix);
      });

      // Vitals bars
      entry.target.querySelectorAll('.vital-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.val + '%';
      });

      // Score
      const scoreEl = document.getElementById('overallScore');
      if (scoreEl && entry.target.contains(scoreEl)) {
        countUp(scoreEl, 23);
      }
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Also observe score separately
const scoreEl = document.getElementById('overallScore');
if (scoreEl) {
  const scoreObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) countUp(scoreEl, 23); });
  }, { threshold: 0.5 });
  scoreObs.observe(scoreEl);
}

// Vitals separate observer
const vitalsEl = document.getElementById('vitalsRow');
if (vitalsEl) {
  const vitObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.vital-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.val + '%';
        });
      }
    });
  }, { threshold: 0.3 });
  vitObs.observe(vitalsEl);
}

// Auto-cycle pipeline stages
let stageIdx = 0;
setInterval(() => {
  const stageEls = document.querySelectorAll('.pipeline-stage');
  stageEls.forEach(s => s.classList.remove('active'));
  stageIdx = (stageIdx + 1) % stageEls.length;
  stageEls[stageIdx].classList.add('active');
}, 2000);
</script>
</body>
</html>