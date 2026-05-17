import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function badgeClass(severity) {
  switch (severity) {
    case "critical":
      return "badge-critical";
    case "high":
      return "badge-high";
    case "medium":
      return "badge-medium";
    case "low":
      return "badge-low";
    default:
      return "badge-medium";
  }
}

const COURTROOM_TABS = [
  { key: "prosecution", label: "Prosecution" },
  { key: "defense", label: "Defense" },
  { key: "verdict", label: "Verdict" },
];

const TAB_TINT = {
  prosecution: "bg-[#FF3B3B]/[0.04] border-l-2 border-[#FF3B3B]/30",
  defense: "bg-[#00C851]/[0.04] border-l-2 border-[#00C851]/30",
  verdict: "bg-[#C8A97E]/[0.04] border-l-2 border-[#C8A97E]/30",
};

// ---------------------------------------------------------------------------
// Section label helper
// ---------------------------------------------------------------------------
function SectionLabel({ children }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.25em] text-[#C8A97E] font-semibold mb-2">
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// ClauseCard
// ---------------------------------------------------------------------------
export default function ClauseCard({ clause, isPlainEnglish = false }) {
  const [courtroomTab, setCourtroomTab] = useState("prosecution");

  if (!clause) return null;

  const {
    title,
    category,
    severity,
    originalText,
    legalExplanation,
    plainEnglish,
    isIndustryStandard,
    courtroom,
    consequences,
    negotiationPunch,
  } = clause;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={clsx(
        "surface-glass rounded-2xl overflow-hidden w-full",
        severity === "critical" && "glow-critical",
        severity === "high" && "glow-brand"
      )}
    >
      {/* ================================================================
          SECTION 1 — Clause Header
          ================================================================ */}
      <div className="px-6 pt-5 pb-4 border-b border-[#22222E]">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-lg text-white font-medium leading-snug">
            {title}
          </h3>
          <span className={clsx("flex-shrink-0 mt-0.5", badgeClass(severity))}>
            {severity}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2.5">
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#22222E] text-[#9A9490] font-medium">
            {category}
          </span>
          {isIndustryStandard ? (
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#00C851]/10 text-[#00C851] font-medium">
              Industry Standard
            </span>
          ) : (
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FF3B3B]/10 text-[#FF3B3B] font-medium">
              Non-Standard
            </span>
          )}
        </div>
      </div>

      {/* ================================================================
          SECTION 2 — Original Clause Text
          ================================================================ */}
      <div className="px-6 py-4 border-b border-[#22222E]">
        <SectionLabel>Original Clause</SectionLabel>
        <div className="border-l-2 border-[#C8A97E]/40 bg-[#0A0A0F]/60 rounded-r-lg px-4 py-3">
          <p className="text-sm italic text-[#9A9490] leading-relaxed" style={{ fontFamily: "var(--font-legal)" }}>
            {originalText}
          </p>
        </div>
      </div>

      {/* ================================================================
          SECTION 3 — Explanation (Legal / Plain English toggle)
          ================================================================ */}
      <div className="px-6 py-4 border-b border-[#22222E]">
        <AnimatePresence mode="wait">
          <motion.div
            key={isPlainEnglish ? "plain" : "legal"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <SectionLabel>
              {isPlainEnglish ? "Plain English" : "Legal Analysis"}
            </SectionLabel>
            <p className="text-sm text-white/90 leading-relaxed">
              {isPlainEnglish ? plainEnglish : legalExplanation}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ================================================================
          SECTION 4 — Clause Courtroom
          ================================================================ */}
      {courtroom && (
        <div className="px-6 py-4 border-b border-[#22222E]">
          <SectionLabel>⚖️ Clause Courtroom</SectionLabel>

          {/* Tab bar */}
          <div className="flex border-b border-[#22222E] mb-3">
            {COURTROOM_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCourtroomTab(tab.key)}
                className={clsx(
                  "flex-1 pb-2 text-xs font-semibold tracking-wide transition-colors",
                  courtroomTab === tab.key
                    ? "text-[#C8A97E] border-b-2 border-[#C8A97E]"
                    : "text-[#9A9490] hover:text-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={courtroomTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className={clsx("rounded-lg px-4 py-3", TAB_TINT[courtroomTab])}
            >
              <p className="text-sm leading-relaxed text-white/85">
                {courtroom[courtroomTab]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ================================================================
          SECTION 5 — Consequence Simulator
          ================================================================ */}
      {consequences && consequences.length > 0 && (
        <div className="px-6 py-4 border-b border-[#22222E]">
          <SectionLabel>Consequence Simulator</SectionLabel>
          <div className="space-y-3">
            {consequences.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3, ease: "easeOut" }}
                className="bg-[#0A0A0F]/50 rounded-lg px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-white/90">{c.scenario}</p>
                  <span className={clsx("flex-shrink-0 mt-0.5", badgeClass(c.severity))}>
                    {c.severity}
                  </span>
                </div>
                <p className="text-xs italic text-[#9A9490] mt-1.5 leading-relaxed">
                  {c.outcome}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================
          SECTION 6 — Negotiation Punch
          ================================================================ */}
      {negotiationPunch && (
        <div className="px-6 py-4">
          <SectionLabel>👊 Negotiation Punch</SectionLabel>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
            {/* Their Clause */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#FF3B3B]/80 font-semibold mb-1.5">
                Their Clause
              </p>
              <div className="border-l-2 border-[#FF3B3B]/40 bg-[#FF3B3B]/[0.04] rounded-r-lg px-3 py-2.5">
                <p className="text-xs text-white/80 leading-relaxed">
                  {negotiationPunch.original}
                </p>
              </div>
            </div>

            {/* Your Counter */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#00C851]/80 font-semibold mb-1.5">
                Your Counter
              </p>
              <div className="border-l-2 border-[#00C851]/40 bg-[#00C851]/[0.04] rounded-r-lg px-3 py-2.5">
                <p className="text-xs text-white/80 leading-relaxed">
                  {negotiationPunch.suggested}
                </p>
              </div>
            </div>
          </div>

          {/* Reasoning */}
          <div className="mt-3">
            <p className="text-[10px] uppercase tracking-widest text-[#9A9490] font-semibold mb-1">
              Why This Works
            </p>
            <p className="text-xs italic text-[#9A9490] leading-relaxed">
              {negotiationPunch.reasoning}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
