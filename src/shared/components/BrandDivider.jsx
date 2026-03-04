import { C } from '../theme'

export default function BrandDivider() {
  return (
    <div style={{ height: 4, borderRadius: 2, overflow: 'hidden', margin: '0 0 32px', background: `linear-gradient(to right, ${C.cyan}, ${C.lightPurple})` }} />
  )
}
