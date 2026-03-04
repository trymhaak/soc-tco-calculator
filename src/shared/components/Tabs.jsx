/**
 * @module shared/components/Tabs
 * @description Horizontal tab bar with underline indicator on the active tab.
 */
import { C } from '../theme'

/**
 * @param {Object} props
 * @param {string} props.active - ID of the currently active tab.
 * @param {(tabId: string) => void} props.onChange - Called with the selected tab ID.
 * @param {Array<{id: string, label: string}>} props.tabs - Tab definitions.
 */
export default function Tabs({ active, onChange, tabs }) {
  return (
    <div style={{ display: 'flex', gap: 0, borderBottom: `2px solid ${C.gray30}`, marginBottom: 24 }}>
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => onChange(tab.id)} style={{
          padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: active === tab.id ? 600 : 400,
          color: active === tab.id ? C.purple : C.textSec,
          borderBottom: active === tab.id ? `2px solid ${C.purple}` : '2px solid transparent',
          marginBottom: -2, transition: 'all 0.2s',
        }}>{tab.label}</button>
      ))}
    </div>
  )
}
