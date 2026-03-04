import { C, FLEX_BETWEEN } from '../theme'

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
