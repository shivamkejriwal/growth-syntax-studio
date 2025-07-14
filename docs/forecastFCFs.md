# Forecasting Free Cash Flows (FCFs) for DCF Models

## What was implemented?
A new module `forecastFCFs.ts` provides a robust function to forecast Free Cash Flows (FCFs) for use in Discounted Cash Flow (DCF) models. This function is designed to be used when explicit analyst FCFs are not available, or when historical FCFs are missing or zero.

## How does it work?
- **Inputs:**
  - Historical data array with at least `REVENUE` and `FCF` fields for each period.
  - Number of years to forecast.
  - Optional override for revenue growth rate.
- **Logic:**
  1. Calculates the average historical FCF margin (FCF/Revenue).
  2. Calculates the compound annual growth rate (CAGR) of revenue, unless an override is provided.
  3. Projects future revenues using the CAGR.
  4. Applies the average FCF margin to forecasted revenues to estimate future FCFs.
- **Output:**
  - Array of forecasted FCFs for each year in the forecast period.

## Why is this useful?
- Provides a data-driven fallback for DCF models when explicit FCFs are missing.
- Improves robustness and transparency of fair value calculations.
- Follows standard equity research methodology, similar to platforms like Simply Wall St and many sell-side analysts.

## Example Usage
```typescript
import { forecastFCFs } from './forecastFCFs';
const hist = [
  { REVENUE: 1000, FCF: 50 },
  { REVENUE: 1100, FCF: 60 },
  { REVENUE: 1200, FCF: 70 },
];
const fcfForecast = forecastFCFs(hist, 5);
// Returns array of 5 forecasted FCFs
```

## Next Steps
- Integrate this function as a fallback in your DCF logic when explicit FCFs and historical FCFs are not available.
- Document and test with real company data to validate results.
