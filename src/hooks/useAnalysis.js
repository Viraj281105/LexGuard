/** Core state machine and reducer for LexGuard analysis workflow. */
// src/hooks/useAnalysis.js — Core state machine for LexGuard analysis
import { useReducer, useCallback } from 'react';
import { validateFile, extractTextFromPDF } from '../lib/pdfParser.js';
import { analyzeContract } from '../lib/ai.js';
import { DEMO_RESULT } from '../constants/demo.js';

// -----------------------------------------------------------------------------
// State machine enum – keep as plain strings for simplicity
// -----------------------------------------------------------------------------

/**
 * @typedef {'landing'|'idle'|'uploading'|'analyzing'|'complete'|'error'|'demo'} AppState
 * Frozen enum of all valid application states in the LexGuard workflow.
 */
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

/**
 * @typedef {Object} ActionTypes
 * @property {string} SET_STATE      — Directly set the appState to a given value.
 * @property {string} SET_ERROR      — Transition to ERROR state with an error message.
 * @property {string} SET_UPLOAD     — Transition to UPLOADING; resets analysis data and stores fileName.
 * @property {string} SET_ANALYZING  — Transition to ANALYZING; resets stage counters.
 * @property {string} SET_COMPLETE   — Transition to COMPLETE with the Gemini analysis result.
 * @property {string} SET_DEMO       — Load pre-built demo data directly into COMPLETE state.
 * @property {string} ENTER_APP      — Move from LANDING to IDLE (user clicked "Enter").
 * @property {string} RESET          — Full reset back to initialState (LANDING screen).
 * @property {string} TOGGLE_PLAIN_ENGLISH — Toggle the isPlainEnglish flag.
 * @property {string} UPDATE_STAGE   — Update the current pipeline stage number and label.
 * @property {string} SET_RAW_TEXT   — Store the extracted raw contract text.
 * @property {string} SET_FILE_NAME  — Store the file name for display.
 * @property {string} DISMISS_ERROR  — Clear the error and return to IDLE.
 */
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

/**
 * Pure reducer handling every state transition in the LexGuard workflow.
 * Each case returns a new state object; no side effects occur here.
 *
 * @param {object} state  - Current application state matching initialState shape
 * @param {{ type: string, payload?: any, meta?: object }} action - Dispatched action
 * @returns {object} Next state
 */
function reducer(state, action) {
  switch (action.type) {
    // Direct state override — used for programmatic transitions
    case ActionTypes.SET_STATE:
      return { ...state, appState: action.payload };
    // Error transition — preserves all other state for recovery
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        appState: AppStates.ERROR,
        errorMessage: action.payload,
      };
    // Upload transition — clears previous analysis, resets stage counters
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
    // Demo shortcut — bypasses the Gemini API entirely, uses action.meta for filename
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
 * Wraps a useReducer-based state machine and exposes the current state
 * plus a set of memoized action dispatchers that UI components can call.
 *
 * @returns {{
 *   appState: AppState,
 *   rawText: string,
 *   fileName: string,
 *   analysisResult: object|null,
 *   errorMessage: string,
 *   currentStage: number,
 *   currentStageLabel: string,
 *   isPlainEnglish: boolean,
 *   analyzeFile: (file: File) => Promise<void>,
 *   analyzeText: (text: string) => Promise<void>,
 *   loadDemo: () => void,
 *   enterApp: () => void,
 *   reset: () => void,
 *   togglePlainEnglish: () => void,
 *   dismissError: () => void,
 * }}
 */
export function useAnalysis() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ---------------------------------------------------------------------------
  // Helper to update the stage during the Gemini call
  // ---------------------------------------------------------------------------

  /**
   * Callback passed to analyzeContract to drive the pipeline animation.
   * @param {number} stageNumber - 1-indexed stage number
   * @param {string} stageLabel  - Human-readable stage description
   */
  const onStageUpdate = useCallback((stageNumber, stageLabel) => {
    dispatch({
      type: ActionTypes.UPDATE_STAGE,
      payload: { stage: stageNumber, label: stageLabel },
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Action: analyze a PDF file selected by the user
  // ---------------------------------------------------------------------------

  /**
   * Validates and analyzes a user-selected PDF file.
   * Transitions: IDLE → UPLOADING → ANALYZING → COMPLETE (or ERROR).
   * @param {File} file - The PDF File object from the file input
   */
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

  /**
   * Analyzes raw pasted contract text (minimum 50 characters).
   * Transitions: IDLE → ANALYZING → COMPLETE (or ERROR).
   * @param {string} text - The raw contract text to analyze
   */
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

  /**
   * Loads the prebuilt NovaTech demo analysis, bypassing the Gemini API.
   * Transitions: any → COMPLETE (with DEMO_RESULT).
   */
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

  /**
   * Transitions the user from the LANDING page to the IDLE (upload) screen.
   */
  const enterApp = useCallback(() => {
    dispatch({ type: ActionTypes.ENTER_APP });
  }, []);

  // ---------------------------------------------------------------------------
  // Action: reset the entire workflow back to the idle state
  // ---------------------------------------------------------------------------

  /**
   * Full reset — returns every field to initialState (back to LANDING screen).
   */
  const reset = useCallback(() => {
    dispatch({ type: ActionTypes.RESET });
  }, []);

  // ---------------------------------------------------------------------------
  // Action: toggle plain‑English mode for the dashboard
  // ---------------------------------------------------------------------------

  /**
   * Toggles the isPlainEnglish flag, switching clause explanations
   * between formal legal analysis and 6th-grade plain English.
   */
  const togglePlainEnglish = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_PLAIN_ENGLISH });
  }, []);

  // ---------------------------------------------------------------------------
  // Action: dismiss an error and return to the idle screen
  // ---------------------------------------------------------------------------

  /**
   * Clears the error message and returns the app to the IDLE state.
   */
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
