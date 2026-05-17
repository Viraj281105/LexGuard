import React, { useCallback, lazy, Suspense, useReducer } from "react";
import { Scale } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { analyzeContract } from "./lib/ai";
import { useAnalysis } from "./hooks/useAnalysis";
import LandingPage from "./components/LandingPage";
import UploadScreen from "./components/UploadScreen";
import PipelineScreen from "./components/PipelineScreen";

import DashboardScreen from "./components/DashboardScreen";

// Stub components to prevent crashes during development

const ErrorScreen = ({ errorMessage, onDismiss }) => (
  <div className="flex flex-col items-center justify-center h-full text-white">
    <p className="mb-4 text-red-400">Error: {errorMessage}</p>
    <button onClick={onDismiss} className="px-4 py-2 bg-red-600 rounded">
      Dismiss
    </button>
  </div>
);

// Header component – persistent across screens
const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50" style={{ height: 56, background: '#0A0A0F', borderBottom: '1px solid #22222E' }}>
    <div className="flex items-center h-full" style={{ padding: '0 24px' }}>
      <Scale size={20} strokeWidth={1.8} style={{ color: '#C8A97E', flexShrink: 0 }} />
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, color: '#C8A97E', fontSize: '1.2rem', marginLeft: 10 }}>LexGuard</h1>
      <span style={{ color: '#9A9490', margin: '0 10px', fontSize: '0.6rem' }}>●</span>
      <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '0.82rem', color: '#9A9490' }}>Read before you bleed.</span>
    </div>
  </header>
);

// State machine is imported from ./hooks/useAnalysis

/**
 * Root application component handling screen routing and transitions.
 */
const App = () => {
  const {
    appState,
    rawText,
    fileName,
    analysisResult,
    errorMessage,
    currentStage,
    currentStageLabel,
    isPlainEnglish,
    analyzeFile,
    analyzeText,
    loadDemo,
    enterApp,
    reset,
    togglePlainEnglish,
    dismissError,
  } = useAnalysis();

  // Determine which screen component to render based on state
  const renderScreen = () => {
    switch (appState) {
      case "landing":
        return <LandingPage onEnter={enterApp} />;

      case "idle":
        return <UploadScreen onFileUpload={analyzeFile} onTextSubmit={analyzeText} onLoadDemo={loadDemo} />;

      case "uploading":
      case "analyzing":
        return <PipelineScreen currentStage={currentStage} currentStageLabel={currentStageLabel} fileName={fileName} />;

      case "complete":
        return (
          <DashboardScreen
            analysisResult={analysisResult}
            fileName={fileName}
            isPlainEnglish={isPlainEnglish}
            onTogglePlainEnglish={togglePlainEnglish}
            onReset={reset}
          />
        );
      case "demo":
        return (
          <DashboardScreen
            analysisResult={analysisResult}
            fileName={fileName}
            isPlainEnglish={isPlainEnglish}
            onTogglePlainEnglish={togglePlainEnglish}
            onReset={reset}
          />
        );
      case "error":
        return <ErrorScreen errorMessage={errorMessage} onDismiss={dismissError} />;

      default:
        return null;
    }
  };

  const isLanding = appState === "landing";

  return (
    <div className="relative min-h-screen bg-base-bg bg-grid bg-radial-glow text-white">
      {!isLanding && <Header />}
      <AnimatePresence mode="wait">
        <motion.div
          key={appState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className={isLanding ? "" : "pt-14 flex items-center justify-center"}
        >
          {renderScreen()}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;
