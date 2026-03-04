# SOC TCO Calculator

Pricing calculator for SoftwareOne's **Managed Detection and Response** (MDR) service. Built for the sales team to generate real-time quotes and export formatted Excel proposals.

**Live demo:** [trymhaak.github.io/soc-tco-calculator](https://trymhaak.github.io/soc-tco-calculator/)

## Features

- **Real-time pricing** — adjust customer size and see offer totals instantly
- **Non-linear sliders** — quadratic scaling gives fine-grained control in the 100–1000 range while still supporting up to 15 000 endpoints
- **Presentation mode** — hides discount controls and internal margin data for customer-facing demos
- **Excel export** — generates a two-sheet workbook: "Tilbud" (customer offer) and "Intern" (discount details)
- **Azure workloads** — optional toggle to add cloud resource monitoring (VMs, App Services, SQL, Storage, AKS)

## Tech stack

| Layer       | Choice                  |
|-------------|-------------------------|
| Framework   | React 18                |
| Build       | Vite 6                  |
| Excel       | ExcelJS                 |
| Styling     | Inline styles + theme   |
| Deploy      | GitHub Pages via Actions |

Zero external UI libraries. No TypeScript (yet). ~880 lines across 18 source files.

## Getting started

```bash
# Install dependencies
npm install

# Start dev server (localhost:3000)
npm run dev

# Production build → dist/
npm run build
```

## Architecture

```
src/
  main.jsx                          Entry point
  App.jsx                           Root wrapper (future extension point)

  shared/                           Reusable across all calculators
    theme.js                        Color palette, style constants, fmt()
    components/
      Slider.jsx                    Range slider with editable value & non-linear scale
      DiscountPills.jsx             Discount percentage selector (0–20%)
      DetailRow.jsx                 Label/value row with optional strikethrough
      Tabs.jsx                      Tab bar
      Toggle.jsx                    Accessible switch (button role="switch")
      MiniInput.jsx                 Compact number input
      SoftwareOneLogo.jsx           Official SVG wordmark
      BrandDivider.jsx              Cyan → light purple gradient line
    excel/
      helpers.js                    Excel formatting utilities (borders, headers, rows)

  calculators/                      One directory per service calculator
    mdr/
      config.js                     Price lines, SKU mapping, slider definitions
      useCalculator.js              Custom hook — all state + memoized computations
      exportToExcel.js              Generates two-sheet .xlsx workbook
      InputPanel.jsx                Left column: sliders, Azure toggle, discounts
      ResultPanel.jsx               Right column: offer details, margin table
      MdrCalculator.jsx             Orchestrator: layout + header + hero
```

### Key design decisions

**Config-driven pricing.** All service lines, SKU codes, and slider ranges are defined in `config.js`. Adding or removing a price line means editing one file — the UI and Excel export adapt automatically.

**Custom hook for state.** `useCalculator()` encapsulates 15 `useState` calls and all `useMemo` computations. Components receive a single `calc` object and destructure what they need.

**Shared components for extensibility.** When SoftwareOne needs a second calculator (e.g. Cloud Management), create `calculators/cloud-mgmt/` with its own config, hook, and panels — all `shared/` components work out of the box.

**Inline styles with theme constants.** For a single-page internal tool, inline styles with a centralized `theme.js` are simpler than CSS modules while keeping the brand system consistent.

## Extensibility

The architecture is designed for adding new service calculators:

```
calculators/
  mdr/          ← current
  cloud-mgmt/   ← future example
    config.js         Define price lines, SKUs, sliders
    useCalculator.js  State + computations
    exportToExcel.js  Excel template
    InputPanel.jsx    Custom input controls
    ResultPanel.jsx   Custom result display
    Calculator.jsx    Orchestrator
```

Each calculator reuses `shared/components/` and `shared/excel/helpers.js`. The `App.jsx` wrapper is the future mount point for a calculator selector or routing.

## Component reference

### Slider

```jsx
<Slider
  label="Antall ansatte"
  value={500}
  onChange={setValue}
  min={50}
  max={10000}
  step={50}
  scale={2}           // Quadratic: more precision at low end
  color={C.purple}    // Track + thumb color
  unit="brukere"      // Optional unit label
  compact             // Reduced spacing
/>
```

The `scale` prop controls the slider curve. `scale={1}` is linear. `scale={2}` is quadratic — the first ~30% of the track covers the 50–1000 range, making fine adjustments much easier. Values are always snapped to `step`.

### Toggle

```jsx
<Toggle
  checked={includeAzure}
  onChange={setIncludeAzure}
  label="Aktiver Azure Workloads"  // ARIA label
/>
```

Renders a `<button role="switch">` with `aria-checked` for keyboard and screen reader accessibility.

### DiscountPills

```jsx
<DiscountPills
  value={10}          // Selected percentage
  onChange={setDiscount}
  color={C.positive}  // Active pill color
/>
```

Renders buttons for 0%, 5%, 10%, 15%, 20%.

## Excel export

The export generates a two-sheet workbook:

| Sheet    | Content                    | Audience |
|----------|----------------------------|----------|
| Tilbud   | Full offer with SKU codes  | Customer |
| Intern   | Discount effect breakdown  | Internal |

Both sheets use SoftwareOne branding (black headers, purple accents). The export always includes full discount data regardless of presentation mode.

## Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. `npm ci` — install dependencies
2. `npm run build` — Vite production build
3. Deploy `dist/` to GitHub Pages

The `base` path in `vite.config.js` must match the repository name.

## Brand identity

Colors and typography follow the [SoftwareOne Brand Identity Guidelines](https://www.softwareone.com):

- **Primary:** Black (#000), White (#FFF)
- **Accent:** Purple (#5B49DE), Dark Blue (#1801B4)
- **Secondary:** Cyan (#00DEFF), Teal (#00ECD4), Light Purple (#B7A5FF)
- **Font:** Arial (digital fallback per brand guidelines)

All brand values are centralized in `shared/theme.js`.
