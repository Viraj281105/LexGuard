import { describe, it, expect } from 'vitest';
import { cn, getSeverityColor, scoreToRiskLevel, getCategoryMeta, truncate, delay } from '../lib/utils.js';

describe('utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('resolves tailwind conflicts', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    });

    it('handles conditional class names', () => {
      expect(cn('base', true && 'active', false && 'hidden', null, undefined)).toBe('base active');
    });
  });

  describe('getSeverityColor', () => {
    it('returns the correct color token for critical', () => {
      const color = getSeverityColor('critical');
      expect(color.hex).toBe('#FF3B3B');
      expect(color.badge).toBe('badge-critical');
    });

    it('falls back to medium for an unknown severity', () => {
      const color = getSeverityColor('unknown-level');
      expect(color.hex).toBe('#FFD700');
      expect(color.badge).toBe('badge-medium');
    });
  });

  describe('scoreToRiskLevel', () => {
    it('maps scores <= 25 to critical', () => {
      expect(scoreToRiskLevel(0)).toBe('critical');
      expect(scoreToRiskLevel(25)).toBe('critical');
    });

    it('maps scores between 26 and 50 to high', () => {
      expect(scoreToRiskLevel(26)).toBe('high');
      expect(scoreToRiskLevel(50)).toBe('high');
    });

    it('maps scores > 75 to low', () => {
      expect(scoreToRiskLevel(76)).toBe('low');
      expect(scoreToRiskLevel(100)).toBe('low');
    });
  });

  describe('getCategoryMeta', () => {
    it('returns the correct metadata for a known category', () => {
      const meta = getCategoryMeta('ip');
      expect(meta.label).toBe('Intellectual Property');
      expect(meta.icon).toBe('🧠');
    });

    it('handles formatting issues and uppercase letters', () => {
      const meta = getCategoryMeta(' Non-Compete ');
      expect(meta.label).toBe('Non-Compete');
      expect(meta.icon).toBe('🚫');
    });

    it('falls back to general for an unknown category', () => {
      const meta = getCategoryMeta('random-category');
      expect(meta.label).toBe('General');
      expect(meta.icon).toBe('📄');
    });
  });

  describe('truncate', () => {
    it('does not truncate strings shorter than max length', () => {
      expect(truncate('Hello world', 50)).toBe('Hello world');
    });

    it('truncates strings longer than max length and appends ellipsis', () => {
      expect(truncate('Hello world', 5)).toBe('Hello…');
    });

    it('uses 120 as the default max length', () => {
      const longString = 'a'.repeat(150);
      const expected = 'a'.repeat(120) + '…';
      expect(truncate(longString)).toBe(expected);
    });
  });

  // ── Additional edge-case tests ──

  describe('edge cases', () => {
    it('truncate returns empty string for empty input', () => {
      expect(truncate('')).toBe('');
      expect(truncate('', 10)).toBe('');
    });

    it('truncate returns empty string for null/undefined input', () => {
      expect(truncate(null)).toBe('');
      expect(truncate(undefined)).toBe('');
    });

    it('getCategoryMeta falls back to general for null input', () => {
      const meta = getCategoryMeta(null);
      expect(meta.label).toBe('General');
      expect(meta.icon).toBe('📄');
    });

    it('scoreToRiskLevel handles boundary value 51 as medium', () => {
      expect(scoreToRiskLevel(51)).toBe('medium');
    });

    it('scoreToRiskLevel handles boundary value 75 as medium', () => {
      expect(scoreToRiskLevel(75)).toBe('medium');
    });

    it('cn resolves multiple overlapping tailwind conflicts', () => {
      const result = cn('text-sm text-red-500 p-2', 'text-lg text-blue-500 p-4');
      expect(result).toContain('text-lg');
      expect(result).toContain('text-blue-500');
      expect(result).toContain('p-4');
      expect(result).not.toContain('text-sm');
      expect(result).not.toContain('text-red-500');
      expect(result).not.toContain('p-2');
    });
  });
});
