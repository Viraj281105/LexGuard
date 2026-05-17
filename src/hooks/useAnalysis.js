/** Core state machine and reducer for LexGuard analysis workflow. */
// src/hooks/useAnalysis.js — Core state machine for LexGuard analysis
import { useReducer, useCallback } from 'react';
import { validateFile, extractTextFromPDF } from '../lib/pdfParser.js';
import { analyzeContract } from '../lib/ai.js';
import { DEMO_RESULT } from '../constants/demo.js';

// -----------------------------------------------------------------------------
// State machine enum – keep as plain strings for simplicity
// -----------------------------------------------------------------------------
export const AppStates = Object.freeze({
  LANDING: 'landing',
  IDLE: 'idle',
  UPLOADING: 'uploading',
  ANALYZING: 'analyzing',
  COMPLETE: 'complete',
  ERROR: 'error',
  DEMO: 'demo',
});

// -----------------------------------------------------------------------------
// Action types for the reducer – one per state transition / data change
// -----------------------------------------------------------------------------
const ActionTypes = {
  SET_STATE: 'SET_STATE',
  SET_ERROR: 'SET_ERROR',
  SET_UPLOAD: 'SET_UPLOAD',
  SET_ANALYZING: 'SET_ANALYZING',
  SET_COMPLETE: 'SET_COMPLETE',
  SET_DEMO: 'SET_DEMO',
  ENTER_APP: 'ENTER_APP',
  RESET: 'RESET',
  TOGGLE_PLAIN_ENGLISH: 'TOGGLE_PLAIN_ENGLISH',
  UPDATE_STAGE: 'UPDATE_STAGE',
  SET_RAW_TEXT: 'SET_RAW_TEXT',
  SET_FILE_NAME: 'SET_FILE_NAME',
  DISMISS_ERROR: 'DISMISS_ERROR',
};

// -----------------------------------------------------------------------------
// Initial state – matches the schema required by the UI
// -----------------------------------------------------------------------------
const initialState = {
  appState: AppStates.LANDING,
  rawText: '',
  fileName: '',
  analysisResult: null,
  errorMessage: '',
  currentStage: 0,
  currentStageLabel: '',
  isPlainEnglish: false,
};

// -----------------------------------------------------------------------------
// Reducer – pure function handling all state transitions
// -----------------------------------------------------------------------------
function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_STATE:
      return { ...state, appState: action.payload };
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        appState: AppStates.ERROR,
        errorMessage: action.payload,
      };
    case ActionTypes.SET_UPLOAD:
      return {
        ...state,
        appState: AppStates.UPLOADING,
        fileName: action.payload,
        errorMessage: '',
        rawText: '',
        analysisResult: null,
        currentStage: 0,
        currentStageLabel: '',
      };
    case ActionTypes.SET_ANALYZING:
      return {
        ...state,
        appState: AppStates.ANALYZING,
        errorMessage: '',
        currentStage: 0,
        currentStageLabel: '',
      };
    case ActionTypes.SET_COMPLETE:
      return {
        ...state,
        appState: AppStates.COMPLETE,
        analysisResult: action.payload,
        errorMessage: '',
      };
    case ActionTypes.SET_DEMO:
      return {
        ...state,
        appState: AppStates.COMPLETE,
        analysisResult: action.payload,
        fileName: action.meta?.fileName ?? state.fileName,
        errorMessage: '',
      };
    case ActionTypes.ENTER_APP:
      return { ...state, appState: AppStates.IDLE };
    case ActionTypes.RESET:
      return { ...initialState };
    case ActionTypes.TOGGLE_PLAIN_ENGLISH:
      return { ...state, isPlainEnglish: !state.isPlainEnglish };
    case ActionTypes.UPDATE_STAGE:
      return {
        ...state,
        currentStage: action.payload.stage,
        currentStageLabel: action.payload.label,
      };
    case ActionTypes.SET_RAW_TEXT:
      return { ...state, rawText: action.payload };
    case ActionTypes.SET_FILE_NAME:
      return { ...state, fileName: action.payload };
    case ActionTypes.DISMISS_ERROR:
      return { ...state, appState: AppStates.IDLE, errorMessage: '' };
    default:
      return state;
  }
}

/**
 * Custom hook that drives the entire LexGuard analysis workflow.
 * It exposes the current state and a set of actions that UI components can call.
 */
export function useAnalysis() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ---------------------------------------------------------------------------
  // Helper to update the stage during the Gemini call
  // ---------------------------------------------------------------------------
  const onStageUpdate = useCallback((stageNumber, stageLabel) => {
    dispatch({
      type: ActionTypes.UPDATE_STAGE,
      payload: { stage: stageNumber, label: stageLabel },
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Action: analyze a PDF file selected by the user
  // ---------------------------------------------------------------------------
  const analyzeFile = useCallback(async (file) => {
    // Validate the file first
    const validation = validateFile(file);
    if (!validation.valid) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: validation.error });
      return;
    }

    // Set uploading state and remember the file name
    dispatch({ type: ActionTypes.SET_UPLOAD, payload: file.name });

    try {
      const text = await extractTextFromPDF(file);
      dispatch({ type: ActionTypes.SET_RAW_TEXT, payload: text });
    } catch (e) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: e.message || 'Failed to extract text from PDF.' });
      return;
    }

    // Begin analysis phase
    dispatch({ type: ActionTypes.SET_ANALYZING });

    try {
      const result = await analyzeContract(state.rawText, onStageUpdate);
      dispatch({ type: ActionTypes.SET_COMPLETE, payload: result });
    } catch (e) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: e.message || 'Analysis failed.' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.rawText]);

  // ---------------------------------------------------------------------------
  // Action: analyze raw pasted text
  // ---------------------------------------------------------------------------
  const analyzeText = useCallback(async (text) => {
    if (!text || text.trim().length < 50) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: 'Please paste a valid contract — the text is too short.',
      });
      return;
    }
    dispatch({ type: ActionTypes.SET_FILE_NAME, payload: 'Pasted Contract' });
    dispatch({ type: ActionTypes.SET_RAW_TEXT, payload: text });
    dispatch({ type: ActionTypes.SET_ANALYZING });
    try {
      const result = await analyzeContract(text, onStageUpdate);
      dispatch({ type: ActionTypes.SET_COMPLETE, payload: result });
    } catch (e) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: e.message || 'Analysis failed.' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // Action: load the built‑in demo data instantly
  // ---------------------------------------------------------------------------
  const loadDemo = useCallback(() => {
    if (!DEMO_RESULT) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: 'Demo data not yet loaded. Please upload a real contract.',
      });
      return;
    }
    dispatch({
      type: ActionTypes.SET_DEMO,
      payload: DEMO_RESULT,
      meta: { fileName: "NovaTech — Employment Agreement.pdf" },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // Action: enter the app from the landing page
  // ---------------------------------------------------------------------------
  const enterApp = useCallback(() => {
    dispatch({ type: ActionTypes.ENTER_APP });
  }, []);

  // ---------------------------------------------------------------------------
  // Action: reset the entire workflow back to the idle state
  // ---------------------------------------------------------------------------
  const reset = useCallback(() => {
    dispatch({ type: ActionTypes.RESET });
  }, []);

  // ---------------------------------------------------------------------------
  // Action: toggle plain‑English mode for the dashboard
  // ---------------------------------------------------------------------------
  const togglePlainEnglish = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_PLAIN_ENGLISH });
  }, []);

  // ---------------------------------------------------------------------------
  // Action: dismiss an error and return to the idle screen
  // ---------------------------------------------------------------------------
  const dismissError = useCallback(() => {
    dispatch({ type: ActionTypes.DISMISS_ERROR });
  }, []);

  // ---------------------------------------------------------------------------
  // Expose everything the UI needs
  // ---------------------------------------------------------------------------
  return {
    appState: state.appState,
    rawText: state.rawText,
    fileName: state.fileName,
    analysisResult: state.analysisResult,
    errorMessage: state.errorMessage,
    currentStage: state.currentStage,
    currentStageLabel: state.currentStageLabel,
    isPlainEnglish: state.isPlainEnglish,
    analyzeFile,
    analyzeText,
    loadDemo,
    enterApp,
    reset,
    togglePlainEnglish,
    dismissError,
  };
}
