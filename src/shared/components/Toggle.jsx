/**
 * @module shared/components/Toggle
 * @description Accessible toggle switch using `<button role="switch">`.
 * Keyboard-focusable and screen-reader friendly via aria-checked and aria-label.
 *
 * @example
 * <Toggle checked={includeAzure} onChange={setIncludeAzure} label="Enable Azure" />
 */
import { C } from '../theme'

/**
 * @param {Object} props
 * @param {boolean} props.checked - Whether the toggle is on.
 * @param {(checked: boolean) => void} props.onChange - Called with the new state.
 * @param {string} props.label - Accessible label (aria-label, not visually rendered).
 */
export default function Toggle({ checked, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        width: 46, height: 24, borderRadius: 12, cursor: 'pointer',
        position: 'relative', border: 'none', padding: 0,
        background: checked ? C.darkBlue : C.gray30,
        transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: C.white,
        position: 'absolute', top: 3, left: checked ? 24 : 4,
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      }} />
    </button>
  )
}
