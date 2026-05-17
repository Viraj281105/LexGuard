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
});
