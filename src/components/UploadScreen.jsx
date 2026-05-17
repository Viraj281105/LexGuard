import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Loader, Shield, Cpu, AlignRight } from "lucide-react";
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
    <motion.div className="flex flex-col min-h-screen items-center justify-center py-8" initial="hidden" animate="visible" variants={containerVariants}>
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

      {/* SECTION 2 – INPUT ZONE */}
      <motion.div className="flex flex-col items-center w-full max-w-2xl mx-auto px-6" custom={3} variants={heroVariants}>
        {/* Tab headers — pill switcher */}
        <div className="flex p-1 mb-6 rounded-lg" style={{ background: '#111118', border: '1px solid #22222E' }}>
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
        <div className="w-full surface-glass rounded-2xl p-8 flex flex-col items-center">
          {activeTab === 0 && (
            <>
              <div
                className={clsx(
                  "w-full h-56 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-colors",
                  dragActive ? "border-gold-500 bg-gold-500/10" : "border-gold-500 hover:border-gold-400 hover:bg-gold-500/5"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
              >
                <Upload className="w-12 h-12 text-gold-500 mb-2" />
                <p className="text-lg font-medium">Drag &amp; Drop your contract here</p>
                <p className="text-sm text-text-muted mt-1">or click to browse</p>
                <p className="text-sm text-text-muted mt-2">PDF up to 10MB</p>
                <input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {file && (
                <div className="mt-4 w-full flex items-center justify-between bg-surface-glass backdrop-blur-md rounded px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-gold-500" />
                    <span className="text-base truncate">{file.name}</span>
                  </div>
                  <button
                    onClick={handleAnalyzeFile}
                    className="px-4 py-2 bg-gold-500 text-black rounded transition-colors hover:bg-gold-600"
                  >
                    Analyze Contract
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 1 && (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-48 rounded p-3 resize-none placeholder:text-text-muted bg-[#111118] text-white border border-[#22222E] focus:border-[#C8A97E] focus:outline-none"
                placeholder="Paste your employment agreement, terms of service, freelance contract, or any legal document here..."
              />
              <div className="w-full flex justify-between items-center mt-2">
                <span className="text-sm text-text-muted">{text.length} characters</span>
                <button
                  onClick={handleAnalyzeText}
                  disabled={text.trim().length < 100}
                  className={clsx(
                    "px-4 py-2 rounded transition-colors",
                    text.trim().length >= 100
                      ? "bg-gold-500 text-black hover:bg-gold-600"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  )}
                >
                  Analyze Contract
                </button>
              </div>
            </>
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
      </motion.div>

      {/* SECTION 3 – FOOTER */}
      <motion.div className="flex flex-col items-center justify-center mt-8" custom={4} variants={heroVariants}>
        <div className="flex space-x-8">
          <div className="flex flex-col items-center bg-surface-glass backdrop-blur-md rounded px-4 py-2">
            <Shield className="w-6 h-6 text-gold-500" />
            <span className={goldGradient}>7 Risk Categories</span>
            <span className="text-xs text-text-muted">Protected</span>
          </div>
          <div className="flex flex-col items-center bg-surface-glass backdrop-blur-md rounded px-4 py-2">
            <Cpu className="w-6 h-6 text-gold-500" />
            <span className={goldGradient}>Real‑time AI Reasoning</span>
            <span className="text-xs text-text-muted">Instant</span>
          </div>
          <div className="flex flex-col items-center bg-surface-glass backdrop-blur-md rounded px-4 py-2">
            <AlignRight className="w-6 h-6 text-gold-500" />
            <span className={goldGradient}>Plain English Mode</span>
            <span className="text-xs text-text-muted">Clear</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
