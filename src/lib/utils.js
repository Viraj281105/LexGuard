// utils.js — LexGuard utility helpers
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with conflict resolution.
 * Uses clsx for conditional classes and tailwind-merge for deduplication.
 * @param  {...any} inputs - Class names, objects, or arrays
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Returns color tokens for a given risk severity level.
 * @param {'critical'|'high'|'medium'|'low'} severity
 * @returns {{ text: string, bg: string, hex: string, badge: string }}
 */
export function getSeverityColor(severity) {
  const map = {
    critical: {
      text: 'text-risk-critical',
      bg: 'bg-risk-critical',
      hex: '#FF3B3B',
      badge: 'badge-critical',
    },
    high: {
      text: 'text-risk-high',
      bg: 'bg-risk-high',
      hex: '#FF8C00',
      badge: 'badge-high',
    },
    medium: {
      text: 'text-risk-medium',
      bg: 'bg-risk-medium',
      hex: '#FFD700',
      badge: 'badge-medium',
    },
    low: {
      text: 'text-risk-low',
      bg: 'bg-risk-low',
      hex: '#00C851',
      badge: 'badge-low',
    },
  };

  return map[severity] || map.medium;
}

/**
 * Converts a 0–100 contract health score to a risk level.
 * Lower scores = more dangerous (worse contract health).
 * @param {number} score - Contract health score (0–100)
 * @returns {'critical'|'high'|'medium'|'low'}
 */
export function scoreToRiskLevel(score) {
  if (score <= 25) return 'critical';
  if (score <= 50) return 'high';
  if (score <= 75) return 'medium';
  return 'low';
}

/**
 * Returns metadata (label and emoji icon) for a contract clause category.
 * @param {string} category - Category key
 * @returns {{ label: string, icon: string }}
 */
export function getCategoryMeta(category) {
  const categories = {
    ip: { label: 'Intellectual Property', icon: '🧠' },
    privacy: { label: 'Privacy & Data', icon: '🔒' },
    financial: { label: 'Financial Terms', icon: '💰' },
    termination: { label: 'Termination', icon: '⚡' },
    arbitration: { label: 'Arbitration', icon: '⚖️' },
    noncompete: { label: 'Non-Compete', icon: '🚫' },
    liability: { label: 'Liability', icon: '🛡️' },
    general: { label: 'General', icon: '📄' },
  };

  const key = category?.toLowerCase().replace(/[\s-_]/g, '');
  return categories[key] || categories.general;
}

/**
 * Truncates text to a maximum length, appending an ellipsis if truncated.
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum character length (default: 120)
 * @returns {string}
 */
export function truncate(text, maxLength = 120) {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Returns a Promise that resolves after the specified number of milliseconds.
 * Useful for staged animations and simulated processing delays.
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
