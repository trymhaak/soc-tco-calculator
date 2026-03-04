import { useState } from 'react'
import { C, FLEX_BETWEEN, fmt } from '../theme'

const RESOLUTION = 1000

export default function Slider({ label, value, onChange, min, max, step, unit, scale = 1, compact = false, color = C.purple }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const range = max - min

  // Non-linear scale: scale=1 → linear, scale=2 → quadratic (more resolution at low end)
  const valueToPos = (v) => {
    if (range === 0) return 0
    const t = Math.max(0, Math.min(1, (v - min) / range))
    return Math.round(Math.pow(t, 1 / scale) * RESOLUTION)
  }

  const posToValue = (p) => {
    const t = p / RESOLUTION
    const raw = min + Math.pow(t, scale) * range
    const snapped = Math.round(raw / step) * step
    return Math.max(min, Math.min(max, snapped))
  }

  const pos = valueToPos(value)
  const pct = (pos / RESOLUTION) * 100

  const commitDraft = () => {
    setEditing(false)
    const parsed = parseInt(draft.replace(/\s/g, ''), 10)
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed))
      onChange(Math.round(clamped / step) * step)
    }
  }

  return (
    <div style={{ marginBottom: compact ? 14 : 24 }}>
      <div style={{ ...FLEX_BETWEEN, marginBottom: 6 }}>
        <span style={{ color: C.textSec, fontSize: compact ? 13 : 14 }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {editing ? (
            <input autoFocus type="text" inputMode="numeric" value={draft}
              onChange={(e) => setDraft(e.target.value)} onBlur={commitDraft}
              onKeyDown={(e) => { if (e.key === 'Enter') commitDraft(); if (e.key === 'Escape') setEditing(false) }}
              style={{ width: compact ? 56 : 90, padding: '2px 8px', fontSize: compact ? 13 : 14, fontWeight: 600, color: C.black, background: C.white, border: `2px solid ${color}`, borderRadius: 4, textAlign: 'right', outline: 'none' }}
            />
          ) : (
            <span onClick={() => { setDraft(String(value)); setEditing(true) }} title="Klikk for å skrive inn eksakt tall"
              style={{ color: C.black, fontSize: compact ? 13 : 14, fontWeight: 600, cursor: 'text', padding: '2px 8px', borderRadius: 4, border: `1px dashed ${C.gray30}`, transition: 'border-color 0.2s', userSelect: 'none' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = color}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = C.gray30}
            >{fmt(value)}</span>
          )}
          {unit && <span style={{ color: C.textMuted, fontSize: 11, minWidth: 55 }}>{unit}</span>}
        </div>
      </div>
      <input type="range" min={0} max={RESOLUTION} value={pos}
        onChange={(e) => onChange(posToValue(Number(e.target.value)))}
        style={{ '--thumb-color': color, width: '100%', height: 5, appearance: 'none', WebkitAppearance: 'none', background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, ${C.gray30} ${pct}%, ${C.gray30} 100%)`, borderRadius: 3, outline: 'none', cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ color: C.textMuted, fontSize: 11 }}>{fmt(min)}</span>
        <span style={{ color: C.textMuted, fontSize: 11 }}>{fmt(max)}</span>
      </div>
    </div>
  )
}
