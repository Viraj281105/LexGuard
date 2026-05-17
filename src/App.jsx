import React, { useCallback, lazy, Suspense, useReducer } from "react";
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
  <header className="fixed top-0 left-0 right-0 h-12 flex items-center px-4 bg-surface-glass backdrop-blur-md z-10">
    <span className="text-2xl mr-2">⚖️</span>
    <h1 className="text-2xl font-playfair text-text-gradient mr-2">LexGuard</h1>
    <span className="text-sm text-text-muted">Read before you bleed.</span>
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
          className={isLanding ? "" : "pt-12 flex items-center justify-center"}
        >
          {renderScreen()}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;
