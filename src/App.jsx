// App.jsx — Scaffold confirmation screen (will be replaced in Step 03)
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';

export default function App() {
  return (
    <div className="relative min-h-screen bg-base flex items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-radial-glow" />

      {/* Scan line */}
      <div className="scan-line" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Icon */}
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute inset-0 rounded-full bg-brand/10 blur-2xl scale-150" />
          <div className="relative w-24 h-24 rounded-2xl bg-elevated border border-brand/20 flex items-center justify-center animate-glow">
            <Scale className="w-12 h-12 text-brand" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-display text-6xl md:text-7xl font-bold tracking-tight text-gradient"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          LexGuard
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="font-body text-lg text-text-muted tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Read before you bleed.
        </motion.p>

        {/* Status indicator */}
        <motion.div
          className="flex items-center gap-3 mt-8 px-5 py-3 rounded-full bg-surface border border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          {/* Pulsing green dot */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-risk-low" />
          </span>

          <span className="font-mono text-sm text-risk-low tracking-wide">
            Scaffold operational. Step 01 complete.
          </span>
        </motion.div>

        {/* Subtle version tag */}
        <motion.p
          className="font-mono text-xs text-text-muted/40 mt-4 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          v1.0.0 — Contract Intelligence Platform
        </motion.p>
      </motion.div>
    </div>
  );
}
