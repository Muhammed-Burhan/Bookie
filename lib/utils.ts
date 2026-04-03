import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a rating score to 1 decimal place
 */
export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined) return 'N/A';
  return score.toFixed(1);
}

/**
 * Get color based on rating score
 */
export function getRatingColorTheme(score: number): string {
  if (score >= 7.0) return 'text-rating-high';
  if (score >= 4.0) return 'text-rating-mid';
  return 'text-rating-low';
}
