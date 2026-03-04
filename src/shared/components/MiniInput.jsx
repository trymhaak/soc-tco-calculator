import { C, FLEX_BETWEEN } from '../theme'

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
