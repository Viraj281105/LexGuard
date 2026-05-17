import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ArrowLeft, ToggleLeft, ToggleRight, AlertTriangle, Search, ExternalLink } from "lucide-react";
import clsx from "clsx";
import VitalsPanel from "./VitalsPanel";
import ClauseCard from "./ClauseCard";

const SEVERITY_FILTERS = ["All", "Critical", "High", "Medium", "Low"];

export default function DashboardScreen({
  analysisResult,
  fileName,
  isPlainEnglish,
  onTogglePlainEnglish,
  onReset,
}) {
  const [activeFilter, setActiveFilter] = useState("All");

  if (!analysisResult) return null;

  const {
    contractType,
    partiesInvolved,
    jurisdiction,
    overallScore,
    riskLevel,
    vitals,
    summary,
    totalClauses,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    clauses,
    legalSources = [],
  } = analysisResult;

  const filteredClauses = clauses.filter((c) => 
    activeFilter === "All" || c.severity.toLowerCase() === activeFilter.toLowerCase()
  );

  return (
    <div className="w-full max-w-5xl mx-auto pb-24 h-full overflow-y-auto">
      {/* COMMAND BAR */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#22222E]">
        <div className="flex items-center gap-4">
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-sm text-[#9A9490] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Upload
          </button>
          <div className="h-4 w-px bg-[#22222E]" />
          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-[#C8A97E]" />
            <span className="text-white truncate max-w-[300px]">{fileName}</span>
          </div>
          <div className="h-4 w-px bg-[#22222E]" />
{legalSources.length > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C8A97E]/10 border border-[#C8A97E]/30">
              <Search className="w-3 h-3 text-[#C8A97E]" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C8A97E]">Search Grounded</span>
            </div>
          )}
        </div>

        <button
          onClick={onTogglePlainEnglish}
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
        >
          <span className={clsx(isPlainEnglish ? "text-[#C8A97E]" : "text-[#9A9490]")}>
            Plain English Mode
          </span>
          {isPlainEnglish ? (
            <ToggleRight className="w-6 h-6 text-[#C8A97E]" />
          ) : (
            <ToggleLeft className="w-6 h-6 text-[#9A9490]" />
          )}
        </button>
      </div>

      {/* METADATA SUMMARY */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="surface-glass rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-[#9A9490] mb-1">Contract Type</p>
          <p className="text-sm font-medium">{contractType}</p>
        </div>
        <div className="surface-glass rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-[#9A9490] mb-1">Jurisdiction</p>
          <p className="text-sm font-medium">{jurisdiction}</p>
        </div>
        <div className="surface-glass rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-[#9A9490] mb-1">Parties</p>
          <p className="text-sm font-medium truncate">
            {partiesInvolved.signerParty} vs {partiesInvolved.otherParty}
          </p>
        </div>
      </div>

      {/* VITALS PANEL */}
      <div className="mb-10">
        <VitalsPanel vitals={vitals} overallScore={overallScore} riskLevel={riskLevel} />
      </div>

      {/* CLAUSE FILTER BAR */}
      <div className="flex items-center gap-2 mb-6 border-b border-[#22222E] pb-4">
        {SEVERITY_FILTERS.map((filter) => {
          let count = "";
          if (filter === "All") count = totalClauses;
          if (filter === "Critical") count = criticalCount;
          if (filter === "High") count = highCount;
          if (filter === "Medium") count = mediumCount;
          if (filter === "Low") count = lowCount;

          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={clsx(
                "px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
                activeFilter === filter
                  ? "bg-[#C8A97E]/10 border-[#C8A97E] text-[#C8A97E]"
                  : "bg-transparent border-transparent text-[#9A9490] hover:text-white hover:bg-[#22222E]"
              )}
            >
              {filter} <span className="ml-1 opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* CLAUSE LIST */}
      <div className="space-y-6 mb-10">
        <AnimatePresence mode="popLayout">
          {filteredClauses.map((clause) => (
            <motion.div
              key={clause.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ClauseCard clause={clause} isPlainEnglish={isPlainEnglish} />
            </motion.div>
          ))}
          {filteredClauses.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-[#9A9490]"
            >
              No clauses match the selected filter.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* EXECUTIVE SUMMARY AT THE BOTTOM */}
      <div className="surface-glass rounded-2xl p-6 border-l-4 border-[#C8A97E]">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-[#C8A97E] mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Executive Summary
        </h3>
        <p className="text-sm leading-relaxed text-white/90">
          {isPlainEnglish ? summary.plainEnglish : summary.legal}
        </p>
      </div>

      {/* GROUNDED LEGAL SOURCES */}
      {legalSources.length > 0 && (
        <div className="surface-glass rounded-2xl p-6 mt-6">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[#C8A97E] mb-4 flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            Grounded Legal Sources
          </h3>
          <div className="space-y-3">
            {legalSources.map((source, idx) => (
              <a
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group p-3 rounded-lg hover:bg-white/[0.03] transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-[#C8A97E] mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-white group-hover:text-[#C8A97E] transition-colors truncate">
                    {source.title}
                  </p>
                  <p className="text-xs text-[#9A9490] underline underline-offset-2 truncate mt-0.5">
                    {source.uri}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
