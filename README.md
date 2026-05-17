# LexGuard

*Read before you bleed.*

LexGuard is an AI-powered contract intelligence platform that treats every clause as a potential weapon aimed at the person signing. Unlike generic document summarizers that regurgitate legalese, LexGuard performs deep adversarial reasoning — analyzing contracts from the perspective of a plaintiff's attorney who assumes every sentence is designed to exploit the signer. It extracts hidden risks, simulates real-world consequences with specific dollar amounts, generates ready-to-use counter-clause language, and delivers the entire analysis in both legal precision and sixth-grade plain English. Built for anyone about to sign something they don't fully understand.

![React 18](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite 5](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Gemini 2.0 Flash](https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?style=flat-square&logo=google&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Hosting-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Features

- **The Clause Courtroom** — Every risky clause is put on trial with three adversarial arguments: Prosecution builds the case against the clause, Defense presents the strongest corporate justification, and Verdict delivers a decisive operational recommendation.

- **The Contract Vitals Monitor** — Five real-time risk gauges score the contract across Financial Risk, Privacy Exposure, Power Balance, Exit Freedom, and IP Ownership Risk on a 0–100 danger scale, rendered as an interactive radar chart.

- **Plain English Mode** — A single toggle switches the entire analysis between formal legal reasoning and brutally direct sixth-grade plain language explanations that use "you" and "they" to make consequences viscerally clear.

- **The Consequence Simulator** — For every critical or high-severity clause, LexGuard generates three realistic real-world scenarios with specific triggering situations, concrete dollar amounts, legal procedures, and timeframes showing exactly how the clause could hurt the signer.

- **Negotiation Punches** — Each dangerous clause comes with the exact problematic language quoted verbatim, a fairer replacement written in proper legal language, and one sentence of tactical reasoning explaining why the change is standard and reasonable — ready to hand to a lawyer or paste into a counteroffer.

## AI Pipeline

LexGuard performs seven sequential adversarial reasoning stages on every contract:

1. **Document Parsing & Classification** — Identifies contract type, parties, and jurisdiction.
2. **Clause Extraction & Categorization** — Extracts every meaningful clause and categorizes it by legal domain.
3. **Adversarial Severity Classification** — Scores each clause as critical, high, medium, or low from the signer's perspective.
4. **Consequence Simulation Engine** — Generates three viscerally realistic worst-case scenarios per dangerous clause.
5. **Multi-Dimensional Risk Scoring** — Computes five independent risk dimensions and an overall contract health score.
6. **Negotiation Intelligence Generation** — Produces counter-clause language and tactical reasoning for every flagged clause.
7. **Plain English Translation Layer** — Rewrites every clause explanation at a sixth-grade reading level.

All seven stages execute in a single Gemini 2.0 Flash call with Google Search Grounding enabled, allowing the model to retrieve and cite real legal statutes, case law, and regulatory guidance during analysis.

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + Vite 5 | Frontend framework and build tool |
| TailwindCSS v3 | Dark premium design system |
| Framer Motion | Pipeline and card animations |
| Recharts | Risk radar chart visualization |
| Gemini 2.0 Flash | Seven-stage adversarial AI reasoning |
| Google Search Grounding | Real-time legal source retrieval (RAG) |
| Google Cloud Text-to-Speech | Dramatic courtroom audio narration |
| pdfjs-dist | Client-side PDF parsing with no server required |
| Firebase Hosting | Real-time GCP deployment |

## Live Demo

[**View Live Demo →**](https://intricate-gamma-496607-q3.web.app)

A pre-loaded demo contract is available on the upload screen under the **Load Demo** tab. It contains a deliberately hostile NovaTech employment agreement with seven weaponized clauses. Judges can see the full seven-stage adversarial analysis — including the Clause Courtroom, Consequence Simulator, and Negotiation Punches — without uploading anything or providing an API key.

## Getting Started

1. Clone the repository:
   `git clone https://github.com/Viraj281105/LexGuard.git && cd LexGuard`

2. Install dependencies:
   `npm install`

3. Create environment variables:
   Copy `.env.example` to `.env` and add your keys:
   `VITE_GEMINI_API_KEY=your_gemini_api_key`
   `VITE_GOOGLE_TTS_KEY=your_google_tts_key`

4. Start the development server:
   `npm run dev`

## Design System

LexGuard's interface is built as a dark premium legal war room — every surface, color, and animation reinforces the gravity of contract risk analysis. The palette anchors on a near-black background `#0A0A0F`, brand gold `#C8A97E` for intelligence-grade accents, and critical red `#FF3B3B` for danger signals. Glass-morphism card surfaces with subtle border luminance create depth without distraction.

Typography pairs Playfair Display for authoritative headings, DM Sans for clean body text, EB Garamond for legal clause rendering, and JetBrains Mono for scores and technical data — each font chosen to reinforce the system's dual identity as both a legal instrument and an intelligence platform.

## Hackathon

Built for **PromptWars by Google × Scaler School of Technology**.

LexGuard was designed to directly address every judging criterion. The seven-stage adversarial pipeline demonstrates technical depth and sophisticated prompt engineering. Google Search Grounding satisfies the RAG requirement by retrieving and citing real legal sources during analysis. The `isIndustryStandard` flag on every clause — which marks whether a clause deviates from standard industry practice — satisfies the benchmark comparison requirement. The Consequence Simulator and Negotiation Punches demonstrate explainable AI by making the model's reasoning transparent, actionable, and grounded in specific real-world outcomes. The entire codebase was generated through AI-assisted prompting with zero manual coding.

## License

MIT
