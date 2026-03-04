import { C } from '../theme'

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
