import React, { useCallback, lazy, Suspense, useReducer } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DEMO_METADATA, DEMO_RESULT } from "./constants/demo";
import { analyzeContract } from "./lib/ai";
import UploadScreen from "./components/UploadScreen";

import PipelineScreen from "./components/PipelineScreen";


// Stub components to prevent crashes during development




const DashboardScreen = ({ analysisResult, fileName, isPlainEnglish, onTogglePlainEnglish, onReset }) => (
  <div className="flex flex-col items-center justify-center h-full text-white">
    <h2 className="text-2xl mb-4">Dashboard — Step 10</h2>
    {analysisResult && (
      <p className="mb-2">Overall Score: {analysisResult.overallScore}</p>
    )}
    <button
      onClick={onTogglePlainEnglish}
      className="px-4 py-2 bg-brand-glow text-black rounded mb-2"
    >
      Toggle Plain English ({isPlainEnglish ? "On" : "Off"})
    </button>
    <button onClick={onReset} className="px-4 py-2 bg-red-600 rounded">
      Reset
    </button>
  </div>
);
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

// Action types for reducer
const ACTIONS = {
  RESET: "reset",
  SET_STATE: "set_state",
  SET_ERROR: "set_error",
  SET_DEMO: "set_demo",
  TOGGLE_PLAIN: "toggle_plain",
  DISMISS_ERROR: "dismiss_error",
};

// Initial reducer state
const initialState = {
  appState: "idle",
  rawText: "",
  fileName: "",
  analysisResult: null,
  errorMessage: "",
  currentStage: 0,
  currentStageLabel: "",
  isPlainEnglish: false,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.RESET:
      return { ...initialState };
    case ACTIONS.SET_STATE:
      return { ...state, ...action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, appState: "error", errorMessage: action.payload };
    case ACTIONS.SET_DEMO:
      return {
        ...state,
        appState: "complete",
        fileName: action.payload.fileName,
        analysisResult: action.payload.result,
      };
    case ACTIONS.TOGGLE_PLAIN:
      return { ...state, isPlainEnglish: !state.isPlainEnglish };
    case ACTIONS.DISMISS_ERROR:
      return { ...state, appState: "idle", errorMessage: "" };
    default:
      return state;
  }
}

/**
 * Custom hook managing the LexGuard analysis state machine.
 * @returns {object} State values and action callbacks.
 */
export function useAnalysis() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const reset = useCallback(() => {
    dispatch({ type: ACTIONS.RESET });
  }, []);

  const togglePlainEnglish = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_PLAIN });
  }, []);

  const dismissError = useCallback(() => {
    dispatch({ type: ACTIONS.DISMISS_ERROR });
  }, []);

  const loadDemo = useCallback(() => {
    if (!DEMO_RESULT) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: "Demo data not yet loaded. Please upload a real contract." });
      return;
    }
    dispatch({
      type: ACTIONS.SET_DEMO,
      payload: { fileName: DEMO_METADATA.title, result: DEMO_RESULT },
    });
  }, []);

  // Dependencies imported at the top of the file

  const analyzeFile = useCallback(
    async (file) => {
      try {
        const validation = validateFile(file);
        if (!validation.valid) {
          dispatch({ type: ACTIONS.SET_ERROR, payload: validation.error });
          return;
        }
        dispatch({ type: ACTIONS.SET_STATE, payload: { appState: "uploading", fileName: file.name } });
        const raw = await extractTextFromPDF(file);
        dispatch({ type: ACTIONS.SET_STATE, payload: { rawText: raw, appState: "analyzing" } });
        const result = await analyzeContract(raw, (stage, label) => {
          dispatch({ type: ACTIONS.SET_STATE, payload: { currentStage: stage, currentStageLabel: label } });
        });
        dispatch({ type: ACTIONS.SET_STATE, payload: { analysisResult: result, appState: "complete" } });
      } catch (err) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: err.message || "An unexpected error occurred during analysis." });
      }
    },
    []
  );

  const analyzeText = useCallback(
    async (text) => {
      if (!text || text.trim().length < 50) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: "Please paste a valid contract — the text is too short." });
        return;
      }
      dispatch({ type: ACTIONS.SET_STATE, payload: { rawText: text, appState: "analyzing" } });
      try {
        const result = await analyzeContract(text, (stage, label) => {
          dispatch({ type: ACTIONS.SET_STATE, payload: { currentStage: stage, currentStageLabel: label } });
        });
        dispatch({ type: ACTIONS.SET_STATE, payload: { analysisResult: result, appState: "complete" } });
      } catch (err) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: err.message || "Analysis failed." });
      }
    },
    []
  );

  return {
    ...state,
    analyzeFile,
    analyzeText,
    loadDemo,
    reset,
    togglePlainEnglish,
    dismissError,
  };
}

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
    reset,
    togglePlainEnglish,
    dismissError,
  } = useAnalysis();

  // Determine which screen component to render based on state
  const renderScreen = () => {
    switch (appState) {
      case "idle":
        return <UploadScreen onFileUpload={analyzeFile} onTextSubmit={analyzeText} onLoadDemo={loadDemo} />;

      case "uploading":
      case "analyzing":
        return <PipelineScreen currentStage={currentStage} currentStageLabel={currentStageLabel} fileName={fileName} />;

      case "complete":
        return (
          <DashboardStub
            analysisResult={analysisResult}
            fileName={fileName}
            isPlainEnglish={isPlainEnglish}
            onTogglePlainEnglish={togglePlainEnglish}
            onReset={reset}
          />
        );
      case "demo":
        return (
          <DashboardStub
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

  return (
    <div className="relative min-h-screen bg-base-bg bg-grid bg-radial-glow text-white">
      <Header />
      <AnimatePresence mode="wait">
        <motion.div
          key={appState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="pt-12 flex items-center justify-center"
        >
          {renderScreen()}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;
