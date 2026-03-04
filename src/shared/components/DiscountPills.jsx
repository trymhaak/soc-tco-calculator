import { C } from '../theme'

export const DISCOUNT_OPTIONS = [0, 5, 10, 15, 20]

export default function DiscountPills({ value, onChange, color }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {DISCOUNT_OPTIONS.map(pct => {
        const active = value === pct
        return (
          <button key={pct} onClick={() => onChange(pct)} style={{
            padding: '4px 10px', borderRadius: 16, fontSize: 12, cursor: 'pointer',
            transition: 'all 0.15s', fontWeight: active ? 700 : 400,
            color: active ? C.white : C.textSec,
            background: active ? color : C.gray10,
            border: `1px solid ${active ? color : C.gray30}`,
          }}>{pct}%</button>
        )
      })}
    </div>
  )
}
