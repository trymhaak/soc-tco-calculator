/**
 * @module shared/excel/helpers
 * @description Reusable ExcelJS formatting utilities for building branded workbooks.
 *
 * These helpers produce consistently styled rows (headers, data, sums, totals)
 * using the SoftwareOne color scheme. They are pure functions with no component
 * state — any calculator can use them to build its own Excel export.
 */

/** ExcelJS number format for Norwegian kroner. */
export const NOK_FMT = '#,##0 "NOK"'

/** ExcelJS number format for percentages. */
export const PCT_FMT = '0%'

/** ARGB hex colors for Excel cells (no leading #, as ExcelJS expects). */
export const XL_COLORS = {
  black:   '000000',
  textSec: '555555',
  purple:  '5B49DE',
  gray30:  'C6C6C6',
  gray10:  'F4F4F4',
  white:   'FFFFFF',
}

/**
 * Create a thin gray border object for all four cell edges.
 * @returns {import('exceljs').Borders}
 */
export function xlBorders() {
  const b = { style: 'thin', color: { argb: XL_COLORS.gray30 } }
  return { top: b, bottom: b, left: b, right: b }
}

/**
 * Format a full-width section header row (black background, white text).
 * @param {import('exceljs').Worksheet} ws - Target worksheet.
 * @param {number} row - Row number (1-indexed).
 * @param {string} text - Header text (placed in column 1).
 * @param {number} cols - Total number of columns to fill.
 */
export function xlSectionHeader(ws, row, text, cols) {
  const r = ws.getRow(row)
  for (let c = 1; c <= cols; c++) {
    r.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: XL_COLORS.black } }
    r.getCell(c).font = { bold: true, size: 11, color: { argb: XL_COLORS.white } }
  }
  r.getCell(1).value = text
  r.height = 24
}

/**
 * Format a table header row (gray background, bold text, right-aligned from col 3+).
 * @param {import('exceljs').Worksheet} ws
 * @param {number} row
 * @param {string[]} headers - Column header labels.
 */
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

/**
 * Write a data row with optional NOK and percentage formatting.
 * @param {import('exceljs').Worksheet} ws
 * @param {number} row
 * @param {Array} values - Cell values (one per column).
 * @param {number[]} [nokCols=[]] - Column indices to format as NOK.
 * @param {number[]} [pctCols=[]] - Column indices to format as percentage.
 */
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

/**
 * Format a subtotal row (gray10 background, bold label and value).
 * @param {import('exceljs').Worksheet} ws
 * @param {number} row
 * @param {string} label - Row label (placed in column 2).
 * @param {number} total - Total value.
 * @param {number} cols - Number of columns to fill.
 * @param {number} nokCol - Column index for the total value.
 */
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

/**
 * Format a grand total row (black background, white bold text).
 * @param {import('exceljs').Worksheet} ws
 * @param {number} row
 * @param {string} label
 * @param {number} total
 * @param {number} cols
 * @param {number} nokCol
 */
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

/**
 * Write all detail rows for a pricing section (SKU, name, qty, price, discount, annual).
 * @param {import('exceljs').Worksheet} ws
 * @param {number} startRow - First available row.
 * @param {Array<{label: string, qty: number, price: number, discPrice: number, annual: number, unit?: string}>} details
 * @param {number} discount - Discount percentage (0–100).
 * @param {Object<string, {sku: string, name: string}>} skuMap - Maps labels to SKU codes.
 * @returns {number} Next available row number.
 */
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
