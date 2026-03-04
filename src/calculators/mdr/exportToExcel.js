import ExcelJS from 'exceljs'
import {
  XL_COLORS, NOK_FMT,
  xlSectionHeader, xlTableHeader, xlDataRow,
  xlSumRow, xlTotalRow, xlWriteOfferSection,
} from '../../shared/excel/helpers'
import { SKU_MAP, EXCEL_HEADERS } from './config'

/**
 * Export calculator data to a formatted Excel workbook with two sheets:
 * - "Tilbud" (customer-facing offer)
 * - "Intern" (internal discount details)
 */
export async function exportToExcel({
  m365, azure, includeAzure,
  m365Discount, azureDiscount,
  offerTotal, listTotal, totalDiscountKr, totalDiscountPct,
}) {
  try {
    const wb = new ExcelJS.Workbook()
    wb.creator = 'SoftwareOne'
    const today = new Date().toISOString().slice(0, 10)

    const platformDetails = m365.details.filter((_, i) => i < 2)
    const endpointDetails = m365.details.filter((_, i) => i >= 2)
    const platformTotal = platformDetails.reduce((s, d) => s + d.annual, 0)
    const endpointTotal = endpointDetails.reduce((s, d) => s + d.annual, 0)

    /* ── Sheet 1: TILBUD ── */
    const ws1 = wb.addWorksheet('Tilbud')
    const T = 8
    ws1.columns = [
      { width: 18 }, { width: 50 }, { width: 10 }, { width: 12 },
      { width: 16 }, { width: 10 }, { width: 18 }, { width: 18 },
    ]

    let r = 1
    ws1.mergeCells(r, 1, r, T)
    const title = ws1.getCell(r, 1)
    title.value = 'SoftwareOne – Managed Detection and Response'
    title.font = { bold: true, size: 14, color: { argb: XL_COLORS.black } }
    title.alignment = { vertical: 'middle' }
    ws1.getRow(r).height = 30
    r++
    ws1.getCell(r, 1).value = 'Dato'
    ws1.getCell(r, 1).font = { size: 10, color: { argb: XL_COLORS.textSec } }
    ws1.getCell(r, 2).value = today
    ws1.getCell(r, 2).font = { size: 10, color: { argb: XL_COLORS.textSec } }
    r += 2

    // Sikkerhetsplattform
    xlSectionHeader(ws1, r, 'SIKKERHETSPLATTFORM', T); r++
    xlTableHeader(ws1, r, EXCEL_HEADERS); r++
    r = xlWriteOfferSection(ws1, r, platformDetails, m365Discount, SKU_MAP)
    xlSumRow(ws1, r, 'Sum Sikkerhetsplattform', Math.round(platformTotal), T, 8); r += 2

    // Microsoft 365
    xlSectionHeader(ws1, r, 'MICROSOFT 365', T); r++
    xlTableHeader(ws1, r, EXCEL_HEADERS); r++
    r = xlWriteOfferSection(ws1, r, endpointDetails, m365Discount, SKU_MAP)
    xlSumRow(ws1, r, 'Sum Microsoft 365', Math.round(endpointTotal), T, 8); r++

    // Azure Workloads
    if (includeAzure && azure.details.length > 0) {
      r++
      xlSectionHeader(ws1, r, 'AZURE WORKLOADS', T); r++
      xlTableHeader(ws1, r, EXCEL_HEADERS); r++
      r = xlWriteOfferSection(ws1, r, azure.details, azureDiscount, SKU_MAP)
      xlSumRow(ws1, r, 'Sum Azure Workloads', Math.round(azure.total), T, 8); r++
    }

    r++
    xlTotalRow(ws1, r, 'TOTALT TILBUD PER ÅR', Math.round(offerTotal), T, 8); r += 2
    ws1.getCell(r, 1).value = '* Lagring av sikkerhetslogger (Microsoft Sentinel) faktureres separat etter forbruk.'
    ws1.getCell(r, 1).font = { italic: true, size: 9, color: { argb: XL_COLORS.textSec } }

    /* ── Sheet 2: INTERN ── */
    const ws2 = wb.addWorksheet('Intern')
    const I = 7
    ws2.columns = [
      { width: 18 }, { width: 50 }, { width: 10 }, { width: 18 },
      { width: 18 }, { width: 16 }, { width: 16 },
    ]

    r = 1
    ws2.mergeCells(r, 1, r, I)
    const t2 = ws2.getCell(r, 1)
    t2.value = 'SoftwareOne – Intern kalkyle (ikke del med kunde)'
    t2.font = { bold: true, size: 14, color: { argb: XL_COLORS.purple } }
    ws2.getRow(r).height = 30
    r++
    ws2.getCell(r, 1).value = 'Dato'
    ws2.getCell(r, 1).font = { size: 10, color: { argb: XL_COLORS.textSec } }
    ws2.getCell(r, 2).value = today
    ws2.getCell(r, 2).font = { size: 10, color: { argb: XL_COLORS.textSec } }
    r += 2

    xlSectionHeader(ws2, r, 'RABATTEFFEKT', I); r++
    xlTableHeader(ws2, r, ['Varenummer', 'Tjeneste', 'Antall', 'Listepris/år', 'Tilbudspris/år', 'Rabatt', 'Rabatt %']); r++

    const allDetails = [
      ...m365.details.map(d => ({ ...d, disc: m365Discount })),
      ...(includeAzure ? azure.details.map(d => ({ ...d, disc: azureDiscount })) : []),
    ]
    for (const d of allDetails) {
      const s = SKU_MAP[d.label] || { sku: '', name: d.label }
      xlDataRow(ws2, r, [s.sku, s.name, d.qty, Math.round(d.listAnnual), Math.round(d.annual), Math.round(d.listAnnual - d.annual), d.disc / 100], [3, 4, 5], [6])
      r++
    }
    xlSumRow(ws2, r, 'TOTALT', Math.round(offerTotal), I, 5)
    ws2.getCell(r, 4).value = Math.round(listTotal)
    ws2.getCell(r, 4).numFmt = NOK_FMT
    ws2.getCell(r, 4).font = { bold: true, size: 10, color: { argb: XL_COLORS.black } }
    ws2.getCell(r, 6).value = Math.round(totalDiscountKr)
    ws2.getCell(r, 6).numFmt = NOK_FMT
    ws2.getCell(r, 6).font = { bold: true, size: 10, color: { argb: XL_COLORS.black } }
    ws2.getCell(r, 7).value = totalDiscountPct / 100
    ws2.getCell(r, 7).numFmt = '0.0%'
    ws2.getCell(r, 7).font = { bold: true, size: 10, color: { argb: XL_COLORS.black } }

    /* ── Download ── */
    const buf = await wb.xlsx.writeBuffer()
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SoftwareOne_MDR_Tilbud_${today}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Excel export failed:', err)
    alert('Kunne ikke eksportere til Excel. Prøv igjen.')
  }
}
