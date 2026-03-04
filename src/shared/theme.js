/**
 * @module shared/theme
 * @description SoftwareOne brand design tokens and reusable style fragments.
 * Single source of truth for colors, spacing patterns, and number formatting.
 *
 * All colors follow the SoftwareOne Brand Identity Guidelines (07-2023).
 * Digital font: Arial (brand fallback), defined in index.html.
 */

/** SoftwareOne brand colour palette. */
export const C = {
  // Primary
  black:       '#000000',
  white:       '#FFFFFF',
  // Neutrals
  gray10:      '#F4F4F4',
  gray30:      '#C6C6C6',
  // Brand Accent
  purple:      '#5B49DE',
  darkBlue:    '#1801B4',
  // Secondary
  teal:        '#00ECD4',
  cyan:        '#00DEFF',
  lightPurple: '#B7A5FF',
  // Functional (derived for readability)
  textSec:     '#555555',
  textMuted:   '#999999',
  positive:    '#0A8F6E',
  positiveBg:  'rgba(10,143,110,0.08)',
}

/** Base card style — white background with subtle border and shadow. */
export const CARD = {
  background: C.white,
  borderRadius: 8,
  border: `1px solid ${C.gray30}`,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
}

/** Uppercase section label style (11px, bold, tracked). */
export const SECTION_LABEL = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 2,
  textTransform: 'uppercase',
}

/** Flex row with space-between alignment. */
export const FLEX_BETWEEN = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

/**
 * Format a number for Norwegian locale (nb-NO) with no decimals.
 * @param {number} n - The number to format.
 * @returns {string} Formatted string, e.g. "1 234".
 */
export const fmt = (n) =>
  new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 0 }).format(n)
