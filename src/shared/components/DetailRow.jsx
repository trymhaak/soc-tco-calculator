/**
 * @module shared/components/DetailRow
 * @description A label/value row used in the offer detail list.
 * Supports an optional subtitle and a strikethrough original price.
 */
import { C, FLEX_BETWEEN } from '../theme'

/**
 * @param {Object} props
 * @param {string} props.label - Line item name.
 * @param {string} props.value - Formatted price string (right-aligned).
 * @param {string} [props.sub] - Optional subtitle (e.g. "600 enheter x 45 kr/mnd").
 * @param {string} [props.strikethrough] - Optional original price shown with line-through.
 */
export default function DetailRow({ label, value, sub, strikethrough }) {
  return (
    <div style={{ ...FLEX_BETWEEN, padding: '12px 0', borderBottom: `1px solid ${C.gray30}` }}>
      <div>
        <span style={{ color: C.black, fontSize: 14 }}>{label}</span>
        {sub && <span style={{ display: 'block', color: C.textMuted, fontSize: 12, marginTop: 2 }}>{sub}</span>}
      </div>
      <div style={{ textAlign: 'right' }}>
        {strikethrough && <span style={{ color: C.textMuted, fontSize: 12, textDecoration: 'line-through', marginRight: 8 }}>{strikethrough}</span>}
        <span style={{ color: C.black, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>{value}</span>
      </div>
    </div>
  )
}
