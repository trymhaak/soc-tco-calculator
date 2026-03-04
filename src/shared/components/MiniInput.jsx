/**
 * @module shared/components/MiniInput
 * @description Compact number input with label and optional unit.
 * Currently unused in MDR calculator (replaced by compact Slider),
 * but kept as a shared component for future calculators.
 */
import { C, FLEX_BETWEEN } from '../theme'

/**
 * @param {Object} props
 * @param {string} props.label - Input label (left-aligned).
 * @param {number} props.value - Current numeric value.
 * @param {(value: number) => void} props.onChange - Called with the new value (clamped to >= 0).
 * @param {string} [props.unit] - Optional unit label after the input.
 */
export default function MiniInput({ label, value, onChange, unit }) {
  return (
    <div style={{ ...FLEX_BETWEEN, padding: '8px 0' }}>
      <span style={{ color: C.black, fontSize: 13 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="number" min={0} value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          style={{
            width: 70, padding: '4px 8px', border: `1px solid ${C.gray30}`, borderRadius: 4,
            fontSize: 13, fontWeight: 600, color: C.black, textAlign: 'right',
            outline: 'none', background: C.white, boxSizing: 'border-box',
          }}
        />
        {unit && <span style={{ color: C.textMuted, fontSize: 11, minWidth: 50 }}>{unit}</span>}
      </div>
    </div>
  )
}
