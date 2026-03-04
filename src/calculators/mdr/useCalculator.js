/**
 * @module calculators/mdr/useCalculator
 * @description Custom React hook encapsulating all MDR calculator state and derived computations.
 *
 * Manages three state groups:
 * - **Customer environment** — employee count, endpoints, phones (slider-driven).
 * - **Azure workloads** — toggle + per-resource quantities.
 * - **UI controls** — discount percentages, active tab, presentation mode.
 *
 * All pricing math is memoised via `useMemo` so the component tree only
 * re-renders when an input actually changes.
 */
import { useState, useMemo, useEffect } from 'react'
import { M365_PRICE_LINES, AZURE_PRICE_LINES } from './config'

/**
 * Calculate list-price and discounted totals for a set of price lines.
 *
 * @param {Array<{label: string, price: number, qty: number, unit: string}>} lines
 *   Enriched price lines (qty already resolved from slider/input values).
 * @param {number} discountPct - Discount percentage (0–20).
 * @returns {{
 *   listTotal: number,
 *   total: number,
 *   details: Array<{label: string, price: number, qty: number, unit: string, listAnnual: number, discPrice: number, annual: number}>
 * }} Section totals and per-line detail objects.
 */
function calcSection(lines, discountPct) {
  let listTotal = 0
  let total = 0
  const details = lines.map(l => {
    const listAnnual = l.qty * l.price * 12
    const discPrice = l.price * (1 - discountPct / 100)
    const annual = l.qty * discPrice * 12
    listTotal += listAnnual
    total += annual
    return { ...l, listAnnual, discPrice, annual }
  })
  return { listTotal, total, details }
}

/**
 * Custom hook providing all state, setters, and computed values for the MDR calculator.
 *
 * @returns {{
 *   employees: number, setEmployees: Function,
 *   endpoints: number, setEndpoints: Function,
 *   phones: number, setPhones: Function,
 *   includeAzure: boolean, setIncludeAzure: Function,
 *   azureVMs: number, setAzureVMs: Function,
 *   azureAppSvc: number, setAzureAppSvc: Function,
 *   azureSQL: number, setAzureSQL: Function,
 *   azureStorage: number, setAzureStorage: Function,
 *   azureAKS: number, setAzureAKS: Function,
 *   m365Discount: number, setM365Discount: Function,
 *   azureDiscount: number, setAzureDiscount: Function,
 *   activeTab: string, setActiveTab: Function,
 *   presentationMode: boolean, setPresentationMode: Function,
 *   tabDefs: Array<{id: string, label: string}>,
 *   users: number, totalDevices: number,
 *   m365: {listTotal: number, total: number, details: Array},
 *   azure: {listTotal: number, total: number, details: Array},
 *   listTotal: number, offerTotal: number,
 *   totalDiscountKr: number, totalDiscountPct: number, hasAnyDiscount: boolean,
 * }}
 */
export function useCalculator() {
  /* Customer environment */
  const [employees, setEmployees] = useState(500)
  const [endpoints, setEndpoints] = useState(600)
  const [phones, setPhones] = useState(300)

  /* Azure workloads */
  const [includeAzure, setIncludeAzure] = useState(false)
  const [azureVMs, setAzureVMs] = useState(5)
  const [azureAppSvc, setAzureAppSvc] = useState(2)
  const [azureSQL, setAzureSQL] = useState(2)
  const [azureStorage, setAzureStorage] = useState(3)
  const [azureAKS, setAzureAKS] = useState(0)

  /* Discounts */
  const [m365Discount, setM365Discount] = useState(0)
  const [azureDiscount, setAzureDiscount] = useState(0)

  /* UI state */
  const [activeTab, setActiveTab] = useState('tilbud')
  const [presentationMode, setPresentationMode] = useState(false)

  /* Derived values */
  const users = employees
  const totalDevices = endpoints + phones

  /* Price calculations */
  const quantities = { endpoints, phones, users }

  const m365Lines = useMemo(() =>
    M365_PRICE_LINES.map(l => ({
      ...l,
      qty: l.qtyKey === 'fixed' ? l.fixedQty : quantities[l.qtyKey],
    })),
    [endpoints, phones, users],
  )

  const azureQuantities = { azureVMs, azureAppSvc, azureSQL, azureStorage, azureAKS }

  const azureLines = useMemo(() => {
    if (!includeAzure) return []
    return AZURE_PRICE_LINES
      .map(l => ({ ...l, qty: azureQuantities[l.qtyKey] }))
      .filter(l => l.qty > 0)
  }, [includeAzure, azureVMs, azureAppSvc, azureSQL, azureStorage, azureAKS])

  const m365 = useMemo(() => calcSection(m365Lines, m365Discount), [m365Lines, m365Discount])
  const azure = useMemo(() => calcSection(azureLines, azureDiscount), [azureLines, azureDiscount])

  const listTotal = m365.listTotal + azure.listTotal
  const offerTotal = m365.total + azure.total
  const totalDiscountKr = listTotal - offerTotal
  const totalDiscountPct = listTotal > 0 ? (totalDiscountKr / listTotal) * 100 : 0
  const hasAnyDiscount = totalDiscountKr > 0

  /* Tab definitions (presentation mode hides rabatt tab) */
  const tabDefs = presentationMode
    ? [{ id: 'tilbud', label: 'Kundetilbud' }]
    : [{ id: 'tilbud', label: 'Kundetilbud' }, { id: 'rabatt', label: 'Rabatt & margin' }]

  /* Fix: ensure active tab is valid when switching to presentation mode */
  useEffect(() => {
    if (presentationMode && activeTab === 'rabatt') {
      setActiveTab('tilbud')
    }
  }, [presentationMode, activeTab])

  return {
    /* Customer inputs */
    employees, setEmployees,
    endpoints, setEndpoints,
    phones, setPhones,

    /* Azure inputs */
    includeAzure, setIncludeAzure,
    azureVMs, setAzureVMs,
    azureAppSvc, setAzureAppSvc,
    azureSQL, setAzureSQL,
    azureStorage, setAzureStorage,
    azureAKS, setAzureAKS,

    /* Discounts */
    m365Discount, setM365Discount,
    azureDiscount, setAzureDiscount,

    /* UI state */
    activeTab, setActiveTab,
    presentationMode, setPresentationMode,
    tabDefs,

    /* Derived / computed */
    users, totalDevices,
    m365, azure,
    listTotal, offerTotal,
    totalDiscountKr, totalDiscountPct, hasAnyDiscount,
  }
}
