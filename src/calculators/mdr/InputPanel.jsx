/**
 * @module calculators/mdr/InputPanel
 * @description Left-column panel containing all user inputs for the MDR calculator.
 *
 * Sections:
 * 1. **Customer organisation** — three sliders (employees, endpoints, phones)
 *    with quadratic scale (`scale={2}`) for better precision at lower volumes.
 * 2. **Device/user summary** — computed totals displayed in a compact card.
 * 3. **M365 discount** — pill selector (hidden in presentation mode).
 * 4. **Azure Workloads** — toggle + five compact sliders (dark blue theme)
 *    with per-resource discount pills.
 * 5. **Total offer** — bottom summary card with optional discount highlight.
 */
import { C, CARD, SECTION_LABEL, FLEX_BETWEEN, fmt } from '../../shared/theme'
import Slider from '../../shared/components/Slider'
import DiscountPills from '../../shared/components/DiscountPills'
import Toggle from '../../shared/components/Toggle'

/**
 * @param {Object} props
 * @param {ReturnType<import('./useCalculator').useCalculator>} props.calc
 *   The full return value of {@link useCalculator}, destructured internally.
 * @returns {JSX.Element}
 */
export default function InputPanel({ calc }) {
  const {
    employees, setEmployees, endpoints, setEndpoints, phones, setPhones,
    includeAzure, setIncludeAzure,
    azureVMs, setAzureVMs, azureAppSvc, setAzureAppSvc,
    azureSQL, setAzureSQL, azureStorage, setAzureStorage, azureAKS, setAzureAKS,
    m365Discount, setM365Discount, azureDiscount, setAzureDiscount,
    presentationMode, totalDevices, users,
    offerTotal, hasAnyDiscount, totalDiscountKr, totalDiscountPct, listTotal,
  } = calc

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Kundeinfo + M365 */}
      <div style={{ ...CARD, padding: 28 }}>
        <h2 style={{ ...SECTION_LABEL, color: C.purple, marginBottom: 24 }}>
          Kundens organisasjon
        </h2>
        <Slider label="Antall ansatte" value={employees} onChange={setEmployees} min={50} max={10000} step={50} scale={2} />
        <Slider label="PC-er og bærbare" value={endpoints} onChange={setEndpoints} min={50} max={15000} step={50} scale={2} />
        <Slider label="Telefoner" value={phones} onChange={setPhones} min={0} max={10000} step={50} scale={2} />

        {/* Oppsummering */}
        <div style={{ background: C.gray10, borderRadius: 6, padding: 16, border: `1px solid ${C.gray30}`, marginBottom: presentationMode ? 0 : 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ ...SECTION_LABEL, color: C.textSec, fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>Enheter</div>
              <div style={{ color: C.black, fontSize: 20, fontWeight: 600 }}>{fmt(totalDevices)}</div>
              <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>{fmt(endpoints)} PC + {fmt(phones)} telefoner</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ ...SECTION_LABEL, color: C.textSec, fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>Brukere</div>
              <div style={{ color: C.black, fontSize: 20, fontWeight: 600 }}>{fmt(users)}</div>
              <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>= ansatte</div>
            </div>
          </div>
        </div>

        {/* M365 rabatt — skjult i presentasjonsmodus */}
        {!presentationMode && (
          <div style={{ borderTop: `1px solid ${C.gray30}`, paddingTop: 16 }}>
            <div style={{ ...FLEX_BETWEEN, marginBottom: 10 }}>
              <span style={{ ...SECTION_LABEL, letterSpacing: 1.5, color: C.textSec }}>
                Microsoft 365 rabatt
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: m365Discount > 0 ? C.positive : C.textMuted }}>
                {m365Discount > 0 ? `−${m365Discount}%` : 'Listepris'}
              </span>
            </div>
            <DiscountPills value={m365Discount} onChange={setM365Discount} color={C.positive} />
          </div>
        )}
      </div>

      {/* Azure Workloads */}
      <div style={{
        ...CARD, padding: 24,
        borderColor: includeAzure ? C.darkBlue + '44' : C.gray30,
        transition: 'border-color 0.2s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: includeAzure ? 20 : 0 }}>
          <Toggle checked={includeAzure} onChange={setIncludeAzure} label="Aktiver Azure Workloads" />
          <div>
            <span style={{ color: C.black, fontSize: 14, fontWeight: 600 }}>Azure Workloads</span>
            <span style={{ display: 'block', color: includeAzure ? C.darkBlue : C.textMuted, fontSize: 12, marginTop: 1 }}>
              {includeAzure ? 'Overvåking av skyressurser aktivert' : 'Klikk for å legge til Azure-overvåking'}
            </span>
          </div>
        </div>

        {includeAzure && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <Slider label="Virtuelle maskiner" value={azureVMs} onChange={setAzureVMs} min={0} max={100} step={1} unit="VM-er" compact color={C.darkBlue} />
            <Slider label="App Services" value={azureAppSvc} onChange={setAzureAppSvc} min={0} max={50} step={1} unit="instanser" compact color={C.darkBlue} />
            <Slider label="SQL-databaser" value={azureSQL} onChange={setAzureSQL} min={0} max={50} step={1} unit="databaser" compact color={C.darkBlue} />
            <Slider label="Lagringkontoer" value={azureStorage} onChange={setAzureStorage} min={0} max={50} step={1} unit="kontoer" compact color={C.darkBlue} />
            <Slider label="Kubernetes (AKS)" value={azureAKS} onChange={setAzureAKS} min={0} max={10} step={1} unit="klustere" compact color={C.darkBlue} />

            {/* Azure rabatt — skjult i presentasjonsmodus */}
            {!presentationMode && (
              <div style={{ borderTop: `1px solid ${C.gray30}`, paddingTop: 12, marginTop: 4 }}>
                <div style={{ ...FLEX_BETWEEN, marginBottom: 10 }}>
                  <span style={{ ...SECTION_LABEL, letterSpacing: 1.5, color: C.darkBlue }}>
                    Azure rabatt
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: azureDiscount > 0 ? C.positive : C.textMuted }}>
                    {azureDiscount > 0 ? `−${azureDiscount}%` : 'Listepris'}
                  </span>
                </div>
                <DiscountPills value={azureDiscount} onChange={setAzureDiscount} color={C.positive} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Totalt tilbud */}
      <div style={{
        background: !presentationMode && hasAnyDiscount ? C.positiveBg : C.gray10,
        borderRadius: 8, padding: 20,
        border: `1px solid ${!presentationMode && hasAnyDiscount ? C.positive + '33' : C.gray30}`,
      }}>
        <div style={FLEX_BETWEEN}>
          <span style={{ color: !presentationMode && hasAnyDiscount ? C.positive : C.textSec, fontSize: 14, fontWeight: 600 }}>
            Totalt tilbud
          </span>
          <span style={{ color: !presentationMode && hasAnyDiscount ? C.positive : C.black, fontSize: 22, fontWeight: 700 }}>
            {fmt(offerTotal)} kr/år
          </span>
        </div>
        {!presentationMode && hasAnyDiscount && (
          <div style={{ color: C.positive, fontSize: 12, marginTop: 6, opacity: 0.8 }}>
            Rabatt: {fmt(totalDiscountKr)} kr/år ({totalDiscountPct.toFixed(1)}% fra listepris {fmt(listTotal)} kr)
          </div>
        )}
      </div>
    </div>
  )
}
