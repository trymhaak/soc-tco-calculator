/* ─── MDR Calculator Configuration ───────────────────────── */

export const SKU_MAP = {
  'Sikkerhetsplattform':        { sku: 'C-Mas-Sec-SIEM', name: 'Managed SIEM' },
  'Døgnkontinuerlig beredskap': { sku: 'C-Mas-Sec-IRT',  name: 'Incident Response Team Agreement' },
  'PC-er og bærbare':           { sku: 'C-Mas-SecEnd',   name: 'Security monitoring (MDR) of endpoints' },
  'Telefoner':                  { sku: 'C-Mas-SecMob',   name: 'Security monitoring (MDR) of mobile devices' },
  'Brukerbeskyttelse':          { sku: 'C-Mas-SecEntID', name: 'Security monitoring (MDR) of identities in Entra ID' },
  'Virtuelle maskiner':         { sku: 'C-Mas-SecVM',    name: 'Security monitoring (MDR) of virtual machines' },
  'App Services':               { sku: 'C-Mas-SecApp',   name: 'Security monitoring (MDR) of App Services' },
  'SQL-databaser':              { sku: 'C-Mas-SecSQL',   name: 'Security monitoring (MDR) of SQL databases' },
  'Lagringkontoer':             { sku: 'C-Mas-SecStor',  name: 'Security monitoring (MDR) of storage accounts' },
  'Kubernetes (AKS)':           { sku: 'C-Mas-SecAKS',   name: 'Security monitoring (MDR) of Kubernetes (AKS)' },
}

export const M365_PRICE_LINES = [
  { label: 'Sikkerhetsplattform',       price: 10000, qtyKey: 'fixed', fixedQty: 1, unit: '' },
  { label: 'Døgnkontinuerlig beredskap', price: 10000, qtyKey: 'fixed', fixedQty: 1, unit: '' },
  { label: 'PC-er og bærbare',           price: 45,    qtyKey: 'endpoints', unit: 'enheter' },
  { label: 'Telefoner',                  price: 25,    qtyKey: 'phones',    unit: 'enheter' },
  { label: 'Brukerbeskyttelse',          price: 20,    qtyKey: 'users',     unit: 'brukere' },
]

export const AZURE_PRICE_LINES = [
  { label: 'Virtuelle maskiner', price: 120, qtyKey: 'azureVMs',     unit: 'VM-er',     defaultQty: 5 },
  { label: 'App Services',       price: 150, qtyKey: 'azureAppSvc',  unit: 'instanser', defaultQty: 2 },
  { label: 'SQL-databaser',      price: 160, qtyKey: 'azureSQL',     unit: 'databaser', defaultQty: 2 },
  { label: 'Lagringkontoer',     price: 100, qtyKey: 'azureStorage', unit: 'kontoer',   defaultQty: 3 },
  { label: 'Kubernetes (AKS)',   price: 700, qtyKey: 'azureAKS',     unit: 'klustere',  defaultQty: 0 },
]

export const SLIDERS = [
  { key: 'employees',  label: 'Antall ansatte',   min: 50, max: 10000, step: 50, defaultValue: 500 },
  { key: 'endpoints',  label: 'PC-er og bærbare', min: 50, max: 15000, step: 50, defaultValue: 600 },
  { key: 'phones',     label: 'Telefoner',        min: 0,  max: 10000, step: 50, defaultValue: 300 },
]

export const EXCEL_HEADERS = [
  'Varenummer', 'Tjeneste', 'Antall', 'Enhet',
  'Pris/mnd', 'Rabatt', 'Tilbudspris/mnd', 'Årlig kostnad',
]

export const FOOTNOTE = '* Lagring av sikkerhetslogger (Microsoft Sentinel) faktureres separat etter forbruk.'
