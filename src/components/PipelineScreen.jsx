import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import clsx from "clsx";

// ---------------------------------------------------------------------------
// The 7 adversarial reasoning stages
// ---------------------------------------------------------------------------
const STAGES = [
  { name: "Document Parsing", desc: "Identifying parties, jurisdiction, contract type" },
  { name: "Clause Extraction", desc: "Isolating every clause and obligation" },
  { name: "Adversarial Classification", desc: "Assessing each clause from your perspective" },
  { name: "Consequence Simulation", desc: "Projecting real-world outcomes" },
  { name: "Risk Scoring", desc: "Calculating 5-dimensional risk vitals" },
  { name: "Negotiation Intelligence", desc: "Generating counter-clause suggestions" },
  { name: "Plain English Translation", desc: "Translating legalese to plain language" },
];

// ---------------------------------------------------------------------------
// Pulsing gold dot indicator
// ---------------------------------------------------------------------------
const PulsingDot = () => (
  <span className="relative flex h-2.5 w-2.5 mr-2">
    <span className="absolute inline-flex h-full w-full rounded-full bg-[#C8A97E] opacity-75 animate-ping" />
    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#C8A97E]" />
  </span>
);

// ---------------------------------------------------------------------------
// Single stage row
// ---------------------------------------------------------------------------
function StageRow({ stage, index, currentStage }) {
  const isComplete = index < currentStage;
  const isActive = index === currentStage;
  const isPending = index > currentStage;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      className={clsx(
        "relative flex items-start gap-4 py-3 pl-4 pr-3 rounded-lg transition-all duration-300",
        isActive && "bg-[#C8A97E]/[0.06] border-l-2 border-[#C8A97E]",
        isPending && "opacity-40"
      )}
    >
      {/* Node circle */}
      <div className="relative flex-shrink-0 mt-0.5">
        {isComplete && (
          <div className="w-7 h-7 rounded-full bg-[#C8A97E] flex items-center justify-center">
            <Check className="w-4 h-4 text-black" strokeWidth={3} />
          </div>
        )}
        {isActive && (
          <div className="w-7 h-7 rounded-full border-2 border-[#C8A97E] flex items-center justify-center">
            <motion.div
              className="w-7 h-7 absolute rounded-full border-2 border-[#C8A97E]"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="w-2.5 h-2.5 rounded-full bg-[#C8A97E]" />
          </div>
        )}
        {isPending && (
          <div className="w-7 h-7 rounded-full border-2 border-white/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white/20" />
          </div>
        )}
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              "text-sm font-semibold tracking-wide",
              isComplete && "text-white",
              isActive && "text-transparent bg-clip-text bg-gradient-to-r from-[#C8A97E] to-[#E8D5B5]",
              isPending && "text-[#9A9490]"
            )}
          >
            {stage.name}
          </span>
          {isActive && (
            <Loader2 className="w-4 h-4 text-[#C8A97E] animate-spin" />
          )}
        </div>
        <p
          className={clsx(
            "text-xs mt-0.5",
            isComplete && "text-[#9A9490]",
            isActive && "text-white/80",
            isPending && "text-[#9A9490]"
          )}
        >
          {stage.desc}
        </p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main PipelineScreen component
// ---------------------------------------------------------------------------
/**
 * Animated pipeline loading screen shown while Gemini analyzes the contract.
 * Displays the 7 adversarial reasoning stages as a vertical timeline with
 * pulsing indicators, completion checkmarks, and an active stage callout.
 *
 * @param {object} props
 * @param {number} [props.currentStage=0]      - 0-indexed stage currently being processed.
 * @param {string} [props.currentStageLabel=''] - Human-readable label for the active stage.
 * @param {string} [props.fileName='']          - Name of the file being analyzed (shown in header).
 * @returns {React.ReactElement}
 */
export default function PipelineScreen({ currentStage = 0, currentStageLabel = "", fileName = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0A0A0F] bg-grid overflow-hidden"
    >
      {/* Scan-line overlay */}
      <div className="scan-line absolute inset-0 pointer-events-none z-[1]" />

      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(200,169,126,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-xl px-6 py-12">
        {/* ── TOP BAR ── */}
        <div className="flex items-center justify-center mb-10">
          <PulsingDot />
          <span className="text-xs text-[#9A9490] tracking-wide uppercase">
            Analyzing: {fileName || "Contract"}
          </span>
        </div>

        {/* ── STAGE TIMELINE ── */}
        <div className="relative w-full">
          {/* Vertical connecting line */}
          <motion.div
            className="absolute left-[17px] top-4 w-px bg-gradient-to-b from-[#C8A97E]/60 via-[#C8A97E]/20 to-transparent origin-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ height: "calc(100% - 2rem)" }}
          />

          {/* Stage rows */}
          <div className="flex flex-col gap-1">
            {STAGES.map((stage, i) => (
              <StageRow key={i} stage={stage} index={i} currentStage={currentStage} />
            ))}
          </div>
        </div>

        {/* ── ACTIVE STAGE CALLOUT ── */}
        <div className="w-full mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStageLabel || currentStage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="surface-glass rounded-xl px-6 py-5 text-center"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#C8A97E] mb-2 font-semibold">
                Currently Processing
              </p>
              <p className="text-xl font-serif text-white">
                {currentStageLabel || STAGES[currentStage]?.desc || "Initializing…"}
              </p>

              {/* Progress bar */}
              <div className="mt-4 w-full h-px bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#C8A97E] to-[#E8D5B5]"
                  initial={{ width: "0%" }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 8, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
