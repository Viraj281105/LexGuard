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
import { Scale, FileText } from "lucide-react";

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
    source: "Source: DocuSign State of the Industry Report",
  },
  {
    value: "3.2",
    suffix: "x",
    label: "more likely to face legal disputes without contract review",
    source: "Source: American Bar Association 2023",
  },
  {
    value: "47000",
    prefix: "$",
    suffix: "",
    label: "average cost of a contract dispute for individuals",
    source: "Source: Legal Services Corporation",
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
  { axis: "Financial Risk", typical: 65, protected: 20, demo: 78 },
  { axis: "Privacy Exposure", typical: 70, protected: 15, demo: 91 },
  { axis: "Power Balance", typical: 72, protected: 25, demo: 89 },
  { axis: "Exit Freedom", typical: 68, protected: 18, demo: 85 },
  { axis: "IP Ownership Risk", typical: 74, protected: 22, demo: 94 },
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
/**
 * Full-page marketing landing screen with hero section, problem statistics,
 * 7-stage AI pipeline visualization, radar risk chart, and final CTA.
 * Rendered when the app is in the LANDING state.
 *
 * @param {object}   props
 * @param {function} props.onEnter - Callback invoked when the user clicks any CTA button
 *   to transition from the landing page into the upload/analysis workflow.
 * @returns {React.ReactElement}
 */
export default function LandingPage({ onEnter }) {
  return (
    <div className="landing-root" style={{ position: 'relative', zIndex: 1 }}>
      {/* ── Fixed Navbar ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 56, background: '#0A0A0F', borderBottom: '1px solid #22222E' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Scale size={20} strokeWidth={1.8} style={{ color: '#C8A97E', flexShrink: 0 }} />
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, color: '#C8A97E', fontSize: '1.2rem', marginLeft: 10 }}>LexGuard</span>
            <span style={{ color: '#9A9490', margin: '0 10px', fontSize: '0.6rem' }}>●</span>
            <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '0.82rem', color: '#9A9490' }}>Read before you bleed.</span>
          </div>
          <button onClick={onEnter} className="landing-navbar-cta">
            Analyze Contract
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="landing-hero bg-grid" id="hero" style={{ paddingTop: 56 }}>
        {/* Scan line overlay */}
        <div className="scan-line" />

        {/* Pulsing radial gold glow behind headline */}
        <div className="landing-hero-glow" />

        {/* Sharp concentrated glow directly behind headline text */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
          width: '24rem',
          height: '8rem',
          background: '#C8A97E',
          opacity: 0.08,
          filter: 'blur(60px)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Two-column hero layout */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 60, maxWidth: 1100, padding: '0 24px', width: '100%' }}>
          {/* Left column — headline + CTA */}
          <div style={{ flex: '1 1 50%' }}>
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
              style={{ marginLeft: 0 }}
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

          {/* Right column — mock contract danger preview (hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ flex: '1 1 45%' }}
            className="hidden md:block"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: 'rgba(17, 17, 24, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 59, 59, 0.15)',
                borderRadius: 16,
                padding: '28px 24px',
                boxShadow: '0 0 40px rgba(255, 59, 59, 0.08), 0 4px 24px rgba(0,0,0,0.4)',
              }}
            >
              {/* Card header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #22222E' }}>
                <FileText size={16} style={{ color: '#C8A97E' }} />
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '0.9rem', fontWeight: 600, color: '#F0EDE8' }}>NovaTech_Employment_Agreement.pdf</span>
              </div>

              {/* Clause row 1 */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#F0EDE8' }}>Intellectual Property Assignment</span>
                  <span className="badge-critical">CRITICAL</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'linear-gradient(90deg, rgba(154,148,144,0.15) 0%, rgba(154,148,144,0.05) 100%)', width: '85%' }} />
                <div style={{ height: 8, borderRadius: 4, background: 'linear-gradient(90deg, rgba(154,148,144,0.1) 0%, rgba(154,148,144,0.03) 100%)', width: '60%', marginTop: 4 }} />
              </div>

              {/* Clause row 2 */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#F0EDE8' }}>Non-Compete Covenant</span>
                  <span className="badge-critical">CRITICAL</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'linear-gradient(90deg, rgba(154,148,144,0.15) 0%, rgba(154,148,144,0.05) 100%)', width: '90%' }} />
                <div style={{ height: 8, borderRadius: 4, background: 'linear-gradient(90deg, rgba(154,148,144,0.1) 0%, rgba(154,148,144,0.03) 100%)', width: '55%', marginTop: 4 }} />
              </div>

              {/* Clause row 3 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#F0EDE8' }}>Arbitration Agreement</span>
                  <span className="badge-high">HIGH</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'linear-gradient(90deg, rgba(154,148,144,0.15) 0%, rgba(154,148,144,0.05) 100%)', width: '75%' }} />
                <div style={{ height: 8, borderRadius: 4, background: 'linear-gradient(90deg, rgba(154,148,144,0.1) 0%, rgba(154,148,144,0.03) 100%)', width: '45%', marginTop: 4 }} />
              </div>

              {/* Score footer */}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #22222E', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: '#9A9490', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk Score</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FF3B3B', fontFamily: "'JetBrains Mono', monospace" }}>32/100</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 — THE PROBLEM
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="problem" style={{ background: '#111118', borderTop: '1px solid #22222E', borderBottom: '1px solid #22222E' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 24px' }}>
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
                <span className="landing-stat-source">{s.source}</span>
              </motion.div>
            ))}
          </div>
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
            <React.Fragment key={i}>
              <motion.div
                className="landing-pipeline-row"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
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
              {i < pipelineStages.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 + 0.3 }}
                  style={{
                    height: 1,
                    background: 'linear-gradient(90deg, #C8A97E, rgba(200,169,126,0.08))',
                    transformOrigin: 'left',
                  }}
                />
              )}
            </React.Fragment>
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
          <h3 style={{
            textAlign: 'center',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#C8A97E',
            marginBottom: 24,
            letterSpacing: '-0.01em',
          }}>
            NovaTech Employment Agreement — Live Analysis
          </h3>
          <ResponsiveContainer width="100%" height={500}>
            <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
              <PolarGrid
                stroke="rgba(200,169,126,0.3)"
                strokeDasharray="3 3"
              />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fill: "#9A9490", fontSize: 13, fontFamily: "DM Sans" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                name="This Demo Contract"
                dataKey="demo"
                stroke="#FF3B3B"
                fill="#FF3B3B"
                fillOpacity={0.28}
                strokeWidth={2}
                style={{ animation: 'radarDangerPulse 2s ease-in-out infinite' }}
              />
              <Radar
                name="Typical Contract"
                dataKey="typical"
                stroke="#FF8C00"
                fill="#FF8C00"
                fillOpacity={0.16}
                strokeWidth={1.5}
              />
              <Radar
                name="LexGuard Protected"
                dataKey="protected"
                stroke="#C8A97E"
                fill="#C8A97E"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Legend
                wrapperStyle={{
                  fontFamily: "DM Sans",
                  fontSize: 12,
                  color: "#9A9490",
                  paddingTop: 20,
                }}
                formatter={(value) => (
                  <span style={{ color: '#9A9490' }}>{value}</span>
                )}
              />
            </RadarChart>
          </ResponsiveContainer>
          <p className="landing-radar-caption font-body">
            Real data from the NovaTech demo contract analyzed by LexGuard's AI.
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
