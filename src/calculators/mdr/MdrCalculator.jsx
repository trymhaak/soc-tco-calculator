/**
 * @module calculators/mdr/MdrCalculator
 * @description Top-level orchestrator for the MDR calculator page.
 *
 * Responsibilities:
 * - Initialises calculator state via {@link useCalculator}.
 * - Renders the page chrome: header (logo, presentation toggle, export button),
 *   hero section, and the two-column grid layout.
 * - Delegates input controls to {@link InputPanel} and results to {@link ResultPanel}.
 * - Wires the Excel export button to {@link exportToExcel}.
 */
import { C, SECTION_LABEL, FLEX_BETWEEN } from '../../shared/theme'
import SoftwareOneLogo from '../../shared/components/SoftwareOneLogo'
import BrandDivider from '../../shared/components/BrandDivider'
import { useCalculator } from './useCalculator'
import { exportToExcel } from './exportToExcel'
import InputPanel from './InputPanel'
import ResultPanel from './ResultPanel'

/**
 * MDR calculator page component.
 *
 * Layout: full-viewport page with a fixed-width (380 px) input column on the left
 * and a fluid result column on the right, max-width 1240 px centred.
 *
 * @returns {JSX.Element}
 */
export default function MdrCalculator() {
  const calc = useCalculator()

  const handleExport = () => exportToExcel({
    m365: calc.m365, azure: calc.azure, includeAzure: calc.includeAzure,
    m365Discount: calc.m365Discount, azureDiscount: calc.azureDiscount,
    offerTotal: calc.offerTotal, listTotal: calc.listTotal,
    totalDiscountKr: calc.totalDiscountKr, totalDiscountPct: calc.totalDiscountPct,
  })

  return (
    <div style={{ minHeight: '100vh', background: C.gray10, color: C.black }}>

      {/* Header */}
      <header style={{ background: C.white, borderBottom: `1px solid ${C.gray30}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px', ...FLEX_BETWEEN }}>
          <SoftwareOneLogo height={40} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ ...SECTION_LABEL, fontSize: 11, color: C.purple, fontWeight: 600 }}>
              Managed Detection and Response
            </span>
            <button onClick={() => calc.setPresentationMode(!calc.presentationMode)} style={{
              background: calc.presentationMode ? C.black : C.gray10,
              color: calc.presentationMode ? C.white : C.textSec,
              border: `1px solid ${calc.presentationMode ? C.black : C.gray30}`,
              borderRadius: 4, padding: '7px 14px', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: 14 }}>{calc.presentationMode ? '◉' : '○'}</span>
              Presentasjon
            </button>
            <button onClick={handleExport} style={{
              background: C.purple, color: C.white, border: 'none', borderRadius: 4,
              padding: '7px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'opacity 0.15s',
            }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <span style={{ fontSize: 14 }}>↓</span> Eksporter Excel
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: C.black, padding: '40px 24px', textAlign: 'center' }}>
        <BrandDivider />
        <h1 style={{ fontSize: 32, fontWeight: 400, color: C.white, margin: '0 0 10px', letterSpacing: -0.5 }}>
          Tilbudskalkulator
        </h1>
        <p style={{ color: C.gray30, fontSize: 15, maxWidth: 560, margin: '0 auto', lineHeight: 1.5 }}>
          {calc.presentationMode
            ? 'Managed Detection and Response – tilbudsoversikt'
            : 'Juster kundens størrelse, velg rabatt og se tilbudet i sanntid'}
        </p>
      </div>

      {/* Main layout */}
      <div style={{
        maxWidth: 1240, margin: '0 auto', padding: '32px 24px',
        display: 'grid', gridTemplateColumns: '380px 1fr', gap: 32,
      }}>
        <InputPanel calc={calc} />
        <ResultPanel calc={calc} />
      </div>
    </div>
  )
}
