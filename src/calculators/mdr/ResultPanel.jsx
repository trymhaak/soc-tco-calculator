import { C, CARD, SECTION_LABEL, FLEX_BETWEEN, fmt } from '../../shared/theme'
import Tabs from '../../shared/components/Tabs'
import DetailRow from '../../shared/components/DetailRow'
import { FOOTNOTE } from './config'

export default function ResultPanel({ calc }) {
  const {
    activeTab, setActiveTab, tabDefs, presentationMode,
    m365, azure, includeAzure,
    m365Discount, azureDiscount,
    offerTotal, listTotal, hasAnyDiscount, totalDiscountKr, totalDiscountPct,
  } = calc

  return (
    <div>
      <div style={{ ...CARD, padding: 28 }}>
        {tabDefs.length > 1 && <Tabs active={activeTab} onChange={setActiveTab} tabs={tabDefs} />}

        <div style={{ animation: 'fadeIn 0.3s ease' }} key={activeTab}>

          {/* Kundetilbud */}
          {activeTab === 'tilbud' && (
            <div>
              {presentationMode && tabDefs.length === 1 && (
                <h3 style={{ ...SECTION_LABEL, color: C.purple, marginBottom: 20 }}>Kundetilbud</h3>
              )}

              {/* M365 */}
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  ...FLEX_BETWEEN,
                  padding: '8px 0', borderBottom: `2px solid ${C.gray30}`, marginBottom: 4,
                }}>
                  <span style={{ ...SECTION_LABEL, color: C.black }}>Microsoft 365</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.black }}>{fmt(m365.total)} kr/år</span>
                </div>
                {m365.details.map((d) => (
                  <DetailRow key={d.label}
                    label={d.label}
                    value={`${fmt(d.annual)} kr/år`}
                    sub={d.qty > 1 ? `${fmt(d.qty)} ${d.unit} × ${fmt(Math.round(d.discPrice))} kr/mnd` : `${fmt(Math.round(d.discPrice))} kr/mnd`}
                    strikethrough={!presentationMode && m365Discount > 0 ? `${fmt(d.price)} kr` : null}
                  />
                ))}
              </div>

              {/* Azure */}
              {includeAzure && azure.details.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    ...FLEX_BETWEEN,
                    padding: '8px 0', borderBottom: `2px solid ${C.darkBlue}22`, marginBottom: 4,
                  }}>
                    <span style={{ ...SECTION_LABEL, color: C.darkBlue }}>Azure Workloads</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.darkBlue }}>{fmt(azure.total)} kr/år</span>
                  </div>
                  {azure.details.map((d) => (
                    <DetailRow key={d.label}
                      label={d.label}
                      value={`${fmt(d.annual)} kr/år`}
                      sub={d.qty > 1 ? `${fmt(d.qty)} ${d.unit} × ${fmt(Math.round(d.discPrice))} kr/mnd` : `${fmt(Math.round(d.discPrice))} kr/mnd`}
                      strikethrough={!presentationMode && azureDiscount > 0 ? `${fmt(d.price)} kr` : null}
                    />
                  ))}
                </div>
              )}

              {/* Totalt */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', padding: '14px 0',
                borderTop: `3px solid ${C.purple}`, marginTop: 8,
              }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: C.purple }}>Totalt tilbud per år</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: C.purple }}>{fmt(offerTotal)} kr</span>
              </div>

              {!presentationMode && hasAnyDiscount && (
                <div style={{ marginTop: 12, padding: 12, background: C.positiveBg, borderRadius: 6, border: `1px solid ${C.positive}33` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: C.positive, fontSize: 13 }}>Rabatt fra listepris</span>
                    <span style={{ color: C.positive, fontSize: 13, fontWeight: 700 }}>−{fmt(totalDiscountKr)} kr/år ({totalDiscountPct.toFixed(1)}%)</span>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 12, padding: 12, background: C.gray10, borderRadius: 6, border: `1px solid ${C.gray30}` }}>
                <span style={{ color: C.textSec, fontSize: 12 }}>{FOOTNOTE}</span>
              </div>
            </div>
          )}

          {/* Rabatt & margin — kun i selgermodus */}
          {!presentationMode && activeTab === 'rabatt' && (
            <div>
              <h4 style={{ color: C.positive, ...SECTION_LABEL, marginBottom: 16 }}>
                Rabatteffekt (kun synlig for deg)
              </h4>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 460 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${C.gray30}` }}>
                      <th style={{ padding: '10px 8px 10px 0', textAlign: 'left', fontWeight: 600, color: C.textSec }}>Prislinje</th>
                      <th style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 600, color: C.textSec }}>Listepris</th>
                      <th style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 600, color: C.textSec }}>Tilbud</th>
                      <th style={{ padding: '10px 0 10px 8px', textAlign: 'right', fontWeight: 600, color: C.positive }}>Rabatt</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} style={{ padding: '10px 0 4px', ...SECTION_LABEL, fontSize: 10, letterSpacing: 1.5, color: C.black }}>
                        Microsoft 365
                      </td>
                    </tr>
                    {m365.details.map((d) => (
                      <tr key={`m365-${d.label}`} style={{ borderBottom: `1px solid ${C.gray30}` }}>
                        <td style={{ padding: '10px 8px 10px 0', color: C.black }}>
                          {d.label}{d.qty > 1 ? ` (${fmt(d.qty)} stk)` : ''}
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', color: C.textMuted, whiteSpace: 'nowrap' }}>{fmt(d.listAnnual)} kr</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>{fmt(d.annual)} kr</td>
                        <td style={{ padding: '10px 0 10px 8px', textAlign: 'right', color: m365Discount > 0 ? C.positive : C.textMuted, fontWeight: 600 }}>
                          {m365Discount > 0 ? `−${m365Discount}%` : '—'}
                        </td>
                      </tr>
                    ))}

                    {includeAzure && azure.details.length > 0 && (
                      <>
                        <tr>
                          <td colSpan={4} style={{ padding: '10px 0 4px', ...SECTION_LABEL, fontSize: 10, letterSpacing: 1.5, color: C.darkBlue }}>
                            Azure Workloads
                          </td>
                        </tr>
                        {azure.details.map((d) => (
                          <tr key={`azure-${d.label}`} style={{ borderBottom: `1px solid ${C.gray30}` }}>
                            <td style={{ padding: '10px 8px 10px 0', color: C.black }}>
                              {d.label}{d.qty > 1 ? ` (${fmt(d.qty)} stk)` : ''}
                            </td>
                            <td style={{ padding: '10px 8px', textAlign: 'right', color: C.textMuted, whiteSpace: 'nowrap' }}>{fmt(d.listAnnual)} kr</td>
                            <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>{fmt(d.annual)} kr</td>
                            <td style={{ padding: '10px 0 10px 8px', textAlign: 'right', color: azureDiscount > 0 ? C.positive : C.textMuted, fontWeight: 600 }}>
                              {azureDiscount > 0 ? `−${azureDiscount}%` : '—'}
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: `3px solid ${C.black}` }}>
                      <td style={{ padding: '12px 8px 12px 0', fontWeight: 700, fontSize: 14 }}>Totalt per år</td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 700, fontSize: 14, color: C.textMuted }}>{fmt(listTotal)} kr</td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 700, fontSize: 14 }}>{fmt(offerTotal)} kr</td>
                      <td style={{ padding: '12px 0 12px 8px', textAlign: 'right', fontWeight: 700, fontSize: 14, color: hasAnyDiscount ? C.positive : C.textMuted }}>
                        {hasAnyDiscount ? `−${fmt(totalDiscountKr)} kr` : '—'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {hasAnyDiscount && (
                <div style={{ marginTop: 20, padding: 16, background: C.positiveBg, borderRadius: 6, border: `1px solid ${C.positive}33`, textAlign: 'center' }}>
                  <div style={{ color: C.positive, ...SECTION_LABEL, letterSpacing: 1, marginBottom: 4 }}>Rabatt gitt</div>
                  <div style={{ color: C.positive, fontSize: 24, fontWeight: 700 }}>{totalDiscountPct.toFixed(1)}%</div>
                  <div style={{ color: C.positive, fontSize: 12, marginTop: 4, opacity: 0.8 }}>{fmt(totalDiscountKr)} kr/år</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer — kun i selgermodus */}
      {!presentationMode && (
        <div style={{ marginTop: 24, padding: 16, textAlign: 'center', color: C.textMuted, fontSize: 12, lineHeight: 1.6 }}>
          Intern selgerversjon – tall er veiledende. Rabatter bør godkjennes iht. gjeldende fullmakter.
        </div>
      )}
    </div>
  )
}
