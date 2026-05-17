import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Mock external heavy dependencies
vi.mock('pdfjs-dist', () => ({
  getDocument: vi.fn(() => ({
    getMetadata: vi.fn(),
    getPage: vi.fn(() => ({
      getTextContent: vi.fn(),
    })),
  })),
}));

vi.mock('@google/generative-ai', () => ({
  GeminiClient: vi.fn(() => ({
    generateContent: vi.fn(),
  })),
}));

// Utils tests
import { cn, getSeverityColor, scoreToRiskLevel, getCategoryMeta, truncate, delay } from '../../src/lib/utils.js';

describe('utils.js', () => {
  it('cn merges class names correctly', () => {
    expect(cn('a', { b: true, c: false })).toBe('a b');
  });

  it('getSeverityColor returns correct mapping for critical', () => {
    const res = getSeverityColor('critical');
    expect(res.text).toBe('text-risk-critical');
    expect(res.hex).toBe('#FF3B3B');
  });

  it('scoreToRiskLevel maps scores correctly', () => {
    expect(scoreToRiskLevel(10)).toBe('critical');
    expect(scoreToRiskLevel(30)).toBe('high');
    expect(scoreToRiskLevel(60)).toBe('medium');
    expect(scoreToRiskLevel(90)).toBe('low');
  });

  it('getCategoryMeta returns default for unknown', () => {
    const meta = getCategoryMeta('unknown-category');
    expect(meta.label).toBe('General');
    expect(meta.icon).toBe('📄');
  });

  it('truncate short text returns unchanged', () => {
    const txt = 'short text';
    expect(truncate(txt, 20)).toBe(txt);
  });

  it('truncate long text adds ellipsis', () => {
    const txt = 'a'.repeat(130);
    const result = truncate(txt, 120);
    expect(result.length).toBe(121); // 120 chars + ellipsis
    expect(result.endsWith('…')).toBe(true);
  });

  it('delay resolves after given time', async () => {
    const start = Date.now();
    await delay(10);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(10);
  });
});

// Reducer tests
import { reducer, AppStates } from '../../src/hooks/useAnalysis.js';

describe('useAnalysis reducer', () => {
  const initial = {
    appState: AppStates.LANDING,
    rawText: '',
    fileName: '',
    analysisResult: null,
    errorMessage: '',
    currentStage: 0,
    currentStageLabel: '',
    isPlainEnglish: false,
  };

  it('landing → idle via ENTER_APP', () => {
    const state = reducer(initial, { type: 'ENTER_APP' });
    expect(state.appState).toBe(AppStates.IDLE);
  });

  it('idle → analyzing via SET_ANALYZING', () => {
    const idleState = { ...initial, appState: AppStates.IDLE };
    const state = reducer(idleState, { type: 'SET_ANALYZING' });
    expect(state.appState).toBe(AppStates.ANALYZING);
  });

  it('analyzing → complete via SET_COMPLETE', () => {
    const analyzing = { ...initial, appState: AppStates.ANALYZING };
    const result = { foo: 'bar' };
    const state = reducer(analyzing, { type: 'SET_COMPLETE', payload: result });
    expect(state.appState).toBe(AppStates.COMPLETE);
    expect(state.analysisResult).toBe(result);
  });

  it('analyzing → error via SET_ERROR', () => {
    const analyzing = { ...initial, appState: AppStates.ANALYZING };
    const err = 'boom';
    const state = reducer(analyzing, { type: 'SET_ERROR', payload: err });
    expect(state.appState).toBe(AppStates.ERROR);
    expect(state.errorMessage).toBe(err);
  });

  it('complete → landing (reset) via RESET', () => {
    const complete = { ...initial, appState: AppStates.COMPLETE };
    const state = reducer(complete, { type: 'RESET' });
    expect(state.appState).toBe(AppStates.LANDING);
  });

  it('unknown action returns current state unchanged', () => {
    const state = reducer(initial, { type: 'UNKNOWN_ACTION' });
    expect(state).toBe(initial);
  });
});

// Component smoke tests
import VitalsPanel from '../../src/components/VitalsPanel.jsx';
import ClauseCard from '../../src/components/ClauseCard.jsx';

describe('Component smoke tests', () => {
  it('renders VitalsPanel with mock data', () => {
    const vitals = {
      financialRisk: 80,
      privacyExposure: 45,
      powerBalance: 20,
      exitFreedom: 60,
      ipOwnershipRisk: 10,
    };
    render(<VitalsPanel vitals={vitals} overallScore={70} riskLevel="medium" />);
    expect(screen.getByText(/Risk Score/i)).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    // Verify each vital label appears
    expect(screen.getByText('Financial Risk')).toBeInTheDocument();
    expect(screen.getByText('Privacy Exposure')).toBeInTheDocument();
  });

  it('renders ClauseCard without crashing', () => {
    const mockClause = {
      title: 'Confidentiality',
      category: 'privacy',
      severity: 'high',
      originalText: 'You must keep data secret.',
      legalExplanation: 'Legal explanation text.',
      plainEnglish: 'Plain English explanation.',
      isIndustryStandard: false,
      courtroom: { prosecution: 'Prosecution text.' },
      consequences: [],
      negotiationPunch: null,
    };
    render(<ClauseCard clause={mockClause} isPlainEnglish={false} />);
    expect(screen.getByText('Confidentiality')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });
});
