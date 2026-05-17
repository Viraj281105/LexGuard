import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Shield } from "lucide-react";

// ---------------------------------------------------------------------------
// Reusable animated counter component — counts up when in view
// ---------------------------------------------------------------------------
function AnimatedStat({ value, suffix = "", prefix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = React.useState(prefix + "0" + suffix);

  React.useEffect(() => {
    if (!isInView) return;
    const numericPart = parseFloat(value.replace(/[^0-9.]/g, ""));
    const duration = 1600;
    const steps = 40;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += numericPart / steps;
      if (current >= numericPart) {
        current = numericPart;
        clearInterval(timer);
      }
      // Format the number appropriately
      let formatted;
      if (Number.isInteger(numericPart)) {
        formatted = Math.round(current).toLocaleString();
      } else {
        formatted = current.toFixed(1);
      }
      setDisplay(prefix + formatted + suffix);
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value, suffix, prefix]);

  return <span ref={ref}>{display}</span>;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const stats = [
  {
    value: "89",
    suffix: "%",
    label: "of employees never fully read their employment contract",
  },
  {
    value: "3.2",
    suffix: "x",
    label: "more likely to face legal disputes without contract review",
  },
  {
    value: "47000",
    prefix: "$",
    suffix: "",
    label: "average cost of a contract dispute for individuals",
  },
];

const pipelineStages = [
  {
    name: "Document Parsing",
    desc: "Identifies contract type, all parties, and jurisdiction instantly.",
  },
  {
    name: "Clause Extraction",
    desc: "Isolates every obligation, restriction, and right in the document.",
  },
  {
    name: "Adversarial Classification",
    desc: "Rates each clause from your perspective, not the drafter's.",
  },
  {
    name: "Consequence Simulation",
    desc: "Projects three real-world scenarios for every risky clause.",
  },
  {
    name: "Risk Scoring",
    desc: "Calculates five risk dimensions into one instant readout.",
  },
  {
    name: "Negotiation Intelligence",
    desc: "Generates counter-clauses you can actually use.",
  },
  {
    name: "Plain English Mode",
    desc: "Translates every clause to language a 12-year-old understands.",
  },
];

const radarData = [
  { axis: "Financial Risk", typical: 65, protected: 20 },
  { axis: "Privacy Exposure", typical: 70, protected: 15 },
  { axis: "Power Balance", typical: 72, protected: 25 },
  { axis: "Exit Freedom", typical: 68, protected: 18 },
  { axis: "IP Ownership Risk", typical: 74, protected: 22 },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ---------------------------------------------------------------------------
// Gold CTA button
// ---------------------------------------------------------------------------
function GoldButton({ children, onClick, floating = false }) {
  return (
    <motion.button
      onClick={onClick}
      className="landing-cta-btn"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      animate={
        floating
          ? { y: [0, -6, 0] }
          : {}
      }
      transition={
        floating
          ? { duration: 2.4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          : { duration: 0.2 }
      }
    >
      {children}
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function LandingPage({ onEnter }) {
  return (
    <div className="landing-root">
      {/* ── Fixed Navbar ── */}
      <nav className="landing-navbar">
        <div className="landing-navbar-inner">
          <div className="landing-navbar-brand">
            <Shield size={20} strokeWidth={1.8} style={{ color: "var(--color-brand)" }} />
            <span className="landing-navbar-logo text-gradient">LexGuard</span>
          </div>
          <button onClick={onEnter} className="landing-navbar-cta">
            Analyze Contract
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="landing-hero bg-grid" id="hero">
        {/* Scan line overlay */}
        <div className="scan-line" />

        {/* Pulsing radial gold glow behind headline */}
        <div className="landing-hero-glow" />

        <div className="landing-hero-content">
          <motion.h1
            className="landing-hero-h1 font-display"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            Your contract has secrets.
          </motion.h1>

          <motion.h2
            className="landing-hero-h2 font-display text-gradient"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            We find them.
          </motion.h2>

          <motion.p
            className="landing-hero-sub font-body"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            LexGuard uses adversarial AI to read every clause, simulate
            consequences, and arm you with counter-arguments — before you sign.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <GoldButton onClick={onEnter}>Analyze Your Contract</GoldButton>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 — THE PROBLEM
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="landing-section" id="problem">
        <motion.h2
          className="landing-section-title font-display"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          Most people sign contracts they don't understand.
        </motion.h2>

        <div className="landing-stats-row">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="landing-stat-card surface-glass"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
            >
              <span className="landing-stat-number font-mono">
                <AnimatedStat
                  value={s.value}
                  suffix={s.suffix}
                  prefix={s.prefix || ""}
                />
              </span>
              <span className="landing-stat-label font-body">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3 — THE SOLUTION (AI Pipeline)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="landing-section" id="pipeline">
        <motion.h2
          className="landing-section-title font-display"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          Seven layers of AI legal intelligence.
        </motion.h2>

        <div className="landing-pipeline">
          {pipelineStages.map((stage, i) => (
            <motion.div
              key={i}
              className="landing-pipeline-row"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={slideLeft}
            >
              <span className="landing-pipeline-num font-mono text-gradient">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="landing-pipeline-info">
                <span className="landing-pipeline-name font-display">
                  {stage.name}
                </span>
                <span className="landing-pipeline-desc font-body">
                  {stage.desc}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4 — RISK VISUALIZATION
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="landing-section" id="risk-viz">
        <motion.h2
          className="landing-section-title font-display"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          Know your risk before you sign.
        </motion.h2>

        <motion.div
          className="landing-radar-wrap"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          <ResponsiveContainer width="100%" height={420}>
            <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
              <PolarGrid
                stroke="rgba(200,169,126,0.12)"
                strokeDasharray="3 3"
              />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fill: "#9A9490", fontSize: 12, fontFamily: "DM Sans" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                name="Typical Employment Contract"
                dataKey="typical"
                stroke="#FF3B3B"
                fill="#FF3B3B"
                fillOpacity={0.18}
                strokeWidth={2}
              />
              <Radar
                name="LexGuard Protected"
                dataKey="protected"
                stroke="#C8A97E"
                fill="#C8A97E"
                fillOpacity={0.22}
                strokeWidth={2}
              />
              <Legend
                wrapperStyle={{
                  fontFamily: "DM Sans",
                  fontSize: 13,
                  color: "#9A9490",
                  paddingTop: 16,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
          <p className="landing-radar-caption font-body">
            Real data from a demo employment agreement analyzed by LexGuard.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5 — FINAL CTA
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="landing-cta-section" id="cta">
        <motion.h2
          className="landing-cta-headline font-display text-gradient"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          Read before you bleed.
        </motion.h2>

        <motion.p
          className="landing-cta-sub font-body"
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          Paste your contract. Upload a PDF. Get the truth in seconds.
        </motion.p>

        <motion.div
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          <GoldButton onClick={onEnter} floating>
            Analyze Your Contract
          </GoldButton>
        </motion.div>
      </section>
    </div>
  );
}
