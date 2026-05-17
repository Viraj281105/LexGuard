import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DollarSign, Eye, Scale, DoorOpen, Cpu } from "lucide-react";
import clsx from "clsx";

// ---------------------------------------------------------------------------
// Vitals definition — order matters for display
// ---------------------------------------------------------------------------
const VITALS_CONFIG = [
  { key: "financialRisk", label: "Financial Risk", Icon: DollarSign },
  { key: "privacyExposure", label: "Privacy Exposure", Icon: Eye },
  { key: "powerBalance", label: "Power Balance", Icon: Scale },
  { key: "exitFreedom", label: "Exit Freedom", Icon: DoorOpen },
  { key: "ipOwnershipRisk", label: "IP Ownership Risk", Icon: Cpu },
];

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

/**
 * Returns the CSS color string for a numeric value 0–100.
 * @param {number} value  — the metric value
 * @param {boolean} invert — if true, lower values are more dangerous (used for overallScore)
 */
function colorForValue(value, invert = false) {
  const v = invert ? 100 - value : value;
  if (v >= 75) return "#FF3B3B"; // critical red
  if (v >= 50) return "#FF8C00"; // high orange
  if (v >= 25) return "#FFD700"; // medium yellow
  return "#00C851"; // low green
}

/**
 * Returns the badge utility class for a given riskLevel string.
 */
function badgeClass(riskLevel) {
  switch (riskLevel) {
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

/**
 * Returns a contextual footer message for the risk level.
 */
function contextMessage(riskLevel) {
  switch (riskLevel) {
    case "critical":
      return "This contract poses extreme risk to the signer.";
    case "high":
      return "Significant clauses require immediate attention.";
    case "medium":
      return "Review flagged clauses before signing.";
    case "low":
      return "Contract appears relatively balanced.";
    default:
      return "";
  }
}

function contextColor(riskLevel) {
  switch (riskLevel) {
    case "critical":
      return "#FF3B3B";
    case "high":
      return "#FF8C00";
    case "medium":
      return "#FFD700";
    case "low":
      return "#00C851";
    default:
      return "#9A9490";
  }
}

// ---------------------------------------------------------------------------
// Animated counter hook
// ---------------------------------------------------------------------------
function useCountUp(target, duration = 1500) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = typeof target === "number" ? target : 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

// ---------------------------------------------------------------------------
// VitalsPanel component
// ---------------------------------------------------------------------------
export default function VitalsPanel({ vitals = {}, overallScore = 0, riskLevel = "medium" }) {
  const displayScore = useCountUp(overallScore, 1500);
  const scoreColor = colorForValue(overallScore, true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={clsx(
        "surface-glass rounded-2xl p-6 w-full",
        riskLevel === "critical" ? "glow-critical" : "glow-brand"
      )}
    >
      {/* ── SECTION 1 — Overall Score Hero ── */}
      <div className="flex flex-col items-center pb-6 border-b border-[#22222E]">
        <span
          className="text-7xl md:text-8xl font-mono font-bold leading-none tabular-nums"
          style={{ color: scoreColor }}
        >
          {displayScore}
        </span>
        <span className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#9A9490] font-semibold">
          Risk Score
        </span>
        <span className={clsx("mt-3", badgeClass(riskLevel))}>
          {riskLevel}
        </span>
      </div>

      {/* ── SECTION 2 — Five Vitals Gauges ── */}
      <div className="py-6 space-y-4 border-b border-[#22222E]">
        {VITALS_CONFIG.map((vital, index) => {
          const rawValue = vitals[vital.key];
          const value = typeof rawValue === "number" ? rawValue : 0;
          const barColor = colorForValue(value, false);
          const { Icon } = vital;

          return (
            <div key={vital.key} className="flex items-center gap-3">
              {/* Icon */}
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color: barColor }} />

              {/* Label */}
              <span className="text-xs text-white w-28 flex-shrink-0 font-medium">
                {vital.label}
              </span>

              {/* Bar */}
              <div className="flex-1 h-1.5 rounded-full bg-[#22222E] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: barColor }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${value}%` }}
                  transition={{
                    duration: 1,
                    delay: 0.15 * index,
                    ease: "easeOut",
                  }}
                />
              </div>

              {/* Percentage */}
              <span
                className="text-xs font-mono w-10 text-right tabular-nums"
                style={{ color: barColor }}
              >
                {value}%
              </span>
            </div>
          );
        })}
      </div>

      {/* ── SECTION 3 — Contextual Footer ── */}
      <div className="pt-4">
        <p
          className="text-xs text-center font-medium"
          style={{ color: contextColor(riskLevel) }}
        >
          {contextMessage(riskLevel)}
        </p>
      </div>
    </motion.div>
  );
}
