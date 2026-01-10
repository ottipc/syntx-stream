// 🎨 DRIFT COLOR MAPPER
// Maps calibration scores to visual colors

import type { DriftColor } from '@/types/calibrax';

/**
 * Maps overall score (0-100) to drift color
 * High score = stable (green)
 * Medium score = warning (yellow)
 * Low score = critical (red)
 */
export function mapDriftColor(overallScore: number): DriftColor {
  if (overallScore >= 80) {
    return {
      color: '#22c55e', // Green
      glow: 0.8,
      label: 'Stable'
    };
  }
  
  if (overallScore >= 50) {
    return {
      color: '#eab308', // Yellow
      glow: 0.6,
      label: 'Warning'
    };
  }
  
  return {
    color: '#ef4444', // Red
    glow: 0.9,
    label: 'Critical'
  };
}
