/**
 * @module App
 * @description Root application component.
 *
 * Currently renders the MDR calculator directly. When additional calculators
 * are added (e.g. SOC, Cloud Governance), this component becomes the
 * mounting point for a router or tab-based calculator selector.
 */
import MdrCalculator from './calculators/mdr/MdrCalculator'

/** @returns {JSX.Element} */
export default function App() {
  return <MdrCalculator />
}
