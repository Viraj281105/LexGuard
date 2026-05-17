import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Loader, Shield, Cpu, AlignRight, AlertTriangle, Eye, Lock, DollarSign } from "lucide-react";
import clsx from "clsx";
import { DEMO_METADATA } from "../constants/demo";

// Gold gradient text class defined in design system
const goldGradient = "text-text-gradient";

const tabs = ["Upload PDF", "Paste Text", "Load Demo"];

export default function UploadScreen({ onFileUpload, onTextSubmit, onLoadDemo }) {
  const [activeTab, setActiveTab] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [placeholderType, setPlaceholderType] = useState("Paste your employment agreement, terms of service, freelance contract, or any legal document here...");

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    }
  };
  const fileInputRef = React.useRef(null);
  const triggerFileSelect = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") setFile(selected);
  };

  const handleAnalyzeFile = () => {
    if (file) onFileUpload(file);
  };

  const handleAnalyzeText = () => {
    if (text.trim().length >= 100) onTextSubmit(text);
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15 } }),
  };
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  return (
    <motion.div className="flex flex-col min-h-screen items-center justify-center py-8 px-4" initial="hidden" animate="visible" variants={containerVariants}>
      {/* SECTION 1 – HERO */}
      <motion.div className="flex flex-col items-center justify-center text-center px-4 mb-6" custom={0} variants={heroVariants}>
        <motion.h1 className="text-5xl md:text-6xl font-playfair font-bold" custom={0} variants={heroVariants}>
          Your contract has secrets.
        </motion.h1>
        <motion.h2 className={clsx("mt-2 text-4xl md:text-5xl font-playfair font-bold", goldGradient)} custom={1} variants={heroVariants}>
          We find them.
        </motion.h2>
        <motion.p className="mt-3 max-w-2xl text-lg text-text-muted" custom={2} variants={heroVariants}>
          Paste your contract, upload a PDF, or load a demo — LexGuard's AI identifies every clause designed to hurt you.
        </motion.p>
      </motion.div>

      {/* SECTION 2 – TWO-COLUMN LAYOUT */}
      <motion.div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8" custom={3} variants={heroVariants}>

        {/* LEFT COLUMN — Context Panel (40%) */}
        <div className="w-full md:w-[38%] flex flex-col gap-6">
          <div className="surface-glass rounded-2xl p-6">
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 600, color: '#C8A97E', marginBottom: 20 }}>What LexGuard Finds</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Hidden IP traps</p>
                  <p className="text-xs text-[#9A9490] mt-0.5">Clauses that transfer your intellectual property rights to the company</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Surveillance clauses</p>
                  <p className="text-xs text-[#9A9490] mt-0.5">Broad monitoring rights over your devices, communications, and activity</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Exit restrictions</p>
                  <p className="text-xs text-[#9A9490] mt-0.5">Non-competes, gardening leave, and punitive termination penalties</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Compensation tricks</p>
                  <p className="text-xs text-[#9A9490] mt-0.5">Clawback provisions, discretionary bonuses, and benefit erosion clauses</p>
                </div>
              </div>
            </div>
          </div>
          <div className="surface-glass rounded-2xl p-6">
            <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: '1.05rem', fontStyle: 'italic', color: '#9A9490', lineHeight: 1.6 }}>
              “The most dangerous contract is the one that looks normal.”
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN — Upload Zone (60%) */}
        <div className="w-full md:w-[62%] flex flex-col">
          {/* Tab headers — pill switcher */}
          <div className="flex p-1 mb-6 rounded-lg self-start" style={{ background: '#111118', border: '1px solid #22222E' }}>
            {tabs.map((title, idx) => (
              <button
                key={title}
                onClick={() => setActiveTab(idx)}
                className={clsx(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                  activeTab === idx
                    ? "text-[#C8A97E] bg-[#1A1A24]"
                    : "text-[#9A9490] bg-transparent hover:text-white"
                )}
              >
                {title}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="w-full surface-glass rounded-2xl p-8 flex flex-col items-center flex-1">
            {activeTab === 0 && (
              <div className="w-full min-h-[24rem] flex flex-col">
                <div
                  className={clsx(
                    "w-full min-h-[16rem] border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300",
                    dragActive
                      ? "border-[#C8A97E] bg-[#C8A97E]/5"
                      : "border-[#22222E] hover:border-[#C8A97E] hover:bg-[#C8A97E]/5"
                  )}
                  style={{ background: dragActive ? undefined : 'linear-gradient(180deg, #111118 0%, #0A0A0F 100%)' }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                >
                  <Upload className="w-12 h-12 text-[#C8A97E] mb-3 opacity-60" />
                  <p className="text-lg font-medium">Drag & Drop your contract here</p>
                  <p className="text-sm text-text-muted mt-1">or click to browse</p>
                  <p className="text-xs text-[#9A9490] mt-2">Supports PDF, DOC, and plain text</p>
                  <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                {file && (
                  <div className="mt-4 w-full flex items-center justify-between surface-glass rounded-lg px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-[#C8A97E]" />
                      <span className="text-base truncate">{file.name}</span>
                    </div>
                    <button
                      onClick={handleAnalyzeFile}
                      className="px-4 py-2 bg-[#C8A97E] text-black rounded font-medium transition-colors hover:bg-[#B8995E]"
                    >
                      Analyze Contract
                    </button>
                  </div>
                )}
                {/* 3-step process strip */}
                <div className="mt-auto pt-6">
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', fontWeight: 700, color: '#C8A97E' }}>01</span>
                      <span className="text-xs text-white font-medium">Upload PDF</span>
                    </div>
                    <span className="text-[#9A9490] text-xs">→</span>
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', fontWeight: 700, color: '#C8A97E' }}>02</span>
                      <span className="text-xs text-white font-medium">AI Analysis</span>
                    </div>
                    <span className="text-[#9A9490] text-xs">→</span>
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', fontWeight: 700, color: '#C8A97E' }}>03</span>
                      <span className="text-xs text-white font-medium">Get Results</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="w-full min-h-[24rem] flex flex-col">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full min-h-[12rem] rounded-lg p-4 resize-none placeholder:text-text-muted bg-[#111118] text-white border border-[#22222E] focus:border-[#C8A97E] focus:outline-none flex-1"
                  placeholder={placeholderType}
                />
                <div className="w-full flex justify-between items-center mt-3">
                  <span className="text-sm text-text-muted">{text.length} characters</span>
                  <button
                    onClick={handleAnalyzeText}
                    disabled={text.trim().length < 100}
                    className={clsx(
                      "px-4 py-2 rounded transition-colors",
                      text.trim().length >= 100
                        ? "bg-[#C8A97E] text-black hover:bg-[#B8995E]"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    Analyze Contract
                  </button>
                </div>
                {/* Contract type example pills */}
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid #22222E' }}>
                  <p className="text-xs text-[#9A9490] mb-3">Try with a contract type:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Employment Agreement", "NDA", "Freelance Contract", "Terms of Service"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setPlaceholderType(`Paste your ${type.toLowerCase()} here...`)}
                        className="px-3 py-1.5 text-xs rounded-full border border-[#22222E] text-[#9A9490] hover:border-[#C8A97E] hover:text-[#C8A97E] transition-colors duration-200"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <>
                <div className="w-full text-center space-y-4">
                  <h3 className="text-2xl font-medium">{DEMO_METADATA.title}</h3>
                  <div className="inline-flex items-center bg-red-600 text-white rounded-full px-3 py-1 text-base">
                    Contains 7 intentionally harmful clauses
                  </div>
                  <p className="text-text-muted text-base max-w-md mx-auto">
                    Experience LexGuard on a realistic employment contract pre-loaded with dangerous clauses — no upload needed.
                  </p>
                  <button
                    onClick={onLoadDemo}
                    className="mt-2 px-8 py-3 bg-transparent text-[#C8A97E] border border-[#C8A97E] rounded-lg transition-colors duration-200 hover:bg-[#C8A97E] hover:text-black"
                  >
                    Analyze Demo Contract
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      </motion.div>

      {/* SECTION 3 – FOOTER */}
      <motion.div className="flex flex-col items-center justify-center mt-10" custom={4} variants={heroVariants}>
        <div className="flex space-x-8">
          <div className="flex flex-col items-center surface-glass rounded-lg px-5 py-3">
            <Shield className="w-6 h-6 text-[#C8A97E]" />
            <span className={goldGradient}>7 Risk Categories</span>
            <span className="text-xs text-text-muted">Protected</span>
          </div>
          <div className="flex flex-col items-center surface-glass rounded-lg px-5 py-3">
            <Cpu className="w-6 h-6 text-[#C8A97E]" />
            <span className={goldGradient}>Real‑time AI Reasoning</span>
            <span className="text-xs text-text-muted">Instant</span>
          </div>
          <div className="flex flex-col items-center surface-glass rounded-lg px-5 py-3">
            <AlignRight className="w-6 h-6 text-[#C8A97E]" />
            <span className={goldGradient}>Plain English Mode</span>
            <span className="text-xs text-text-muted">Clear</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
