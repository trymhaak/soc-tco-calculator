/* ─── Excel formatting constants ─────────────────────────── */
export const NOK_FMT = '#,##0 "NOK"'
export const PCT_FMT = '0%'

export const XL_COLORS = {
  black:   '000000',
  textSec: '555555',
  purple:  '5B49DE',
  gray30:  'C6C6C6',
  gray10:  'F4F4F4',
  white:   'FFFFFF',
}

/* ─── Excel helper functions ─────────────────────────────── */

export function xlBorders() {
  const b = { style: 'thin', color: { argb: XL_COLORS.gray30 } }
  return { top: b, bottom: b, left: b, right: b }
}

export function xlSectionHeader(ws, row, text, cols) {
  const r = ws.getRow(row)
  for (let c = 1; c <= cols; c++) {
    r.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: XL_COLORS.black } }
    r.getCell(c).font = { bold: true, size: 11, color: { argb: XL_COLORS.white } }
  }
  r.getCell(1).value = text
  r.height = 24
}

export function xlTableHeader(ws, row, headers) {
  const r = ws.getRow(row)
  const borders = xlBorders()
  headers.forEach((h, i) => {
    const cell = r.getCell(i + 1)
    cell.value = h
    cell.font = { bold: true, size: 10, color: { argb: XL_COLORS.black } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: XL_COLORS.gray30 } }
    cell.border = borders
    cell.alignment = { vertical: 'middle', horizontal: i >= 2 ? 'right' : 'left' }
  })
  r.height = 22
}

export function xlDataRow(ws, row, values, nokCols = [], pctCols = []) {
  const r = ws.getRow(row)
  const borders = xlBorders()
  values.forEach((v, i) => {
    const cell = r.getCell(i + 1)
    cell.value = v
    cell.font = { size: 10, color: { argb: XL_COLORS.textSec } }
    cell.border = borders
    cell.alignment = { vertical: 'middle', horizontal: i >= 2 ? 'right' : 'left' }
    if (nokCols.includes(i)) cell.numFmt = NOK_FMT
    if (pctCols.includes(i)) cell.numFmt = PCT_FMT
  })
}

export function xlSumRow(ws, row, label, total, cols, nokCol) {
  const r = ws.getRow(row)
  const borders = xlBorders()
  for (let c = 1; c <= cols; c++) {
    r.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: XL_COLORS.gray10 } }
    r.getCell(c).border = borders
  }
  r.getCell(2).value = label
  r.getCell(2).font = { bold: true, size: 10, color: { argb: XL_COLORS.black } }
  r.getCell(nokCol).value = total
  r.getCell(nokCol).numFmt = NOK_FMT
  r.getCell(nokCol).font = { bold: true, size: 10, color: { argb: XL_COLORS.black } }
  r.height = 22
}

export function xlTotalRow(ws, row, label, total, cols, nokCol) {
  const r = ws.getRow(row)
  const borders = xlBorders()
  for (let c = 1; c <= cols; c++) {
    r.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: XL_COLORS.black } }
    r.getCell(c).border = borders
  }
  r.getCell(2).value = label
  r.getCell(2).font = { bold: true, size: 11, color: { argb: XL_COLORS.white } }
  r.getCell(nokCol).value = total
  r.getCell(nokCol).numFmt = NOK_FMT
  r.getCell(nokCol).font = { bold: true, size: 11, color: { argb: XL_COLORS.white } }
  r.height = 26
}

export function xlWriteOfferSection(ws, startRow, details, discount, skuMap) {
  let row = startRow
  for (const d of details) {
    const s = skuMap[d.label] || { sku: '', name: d.label }
    xlDataRow(ws, row, [
      s.sku, s.name, d.qty, d.unit || 'stk',
      Math.round(d.price), discount / 100,
      Math.round(d.discPrice), Math.round(d.annual),
    ], [4, 6, 7], [5])
    row++
  }
  return row
}
