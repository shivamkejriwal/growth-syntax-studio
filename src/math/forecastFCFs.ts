/**
 * forecastFCFs.ts
 *
 * This module provides a robust function to forecast Free Cash Flows (FCFs) for use in DCF models.
 * It is designed to be used when explicit analyst FCFs are not available, or when historical FCFs are missing/zero.
 *
 * The function uses historical revenue and FCF data to estimate a typical FCF margin, then projects future FCFs
 * by applying this margin to forecasted revenues (using a compound annual growth rate).
 *
 * Usage:
 *   import { forecastFCFs } from './forecastFCFs';
 *   const fcfForecast = forecastFCFs(historicalData, forecastYears, optionalGrowthRate);
 *
 * Inputs:
 *   - historicalData: Array of objects with at least 'REVENUE' and 'FCF' fields (numbers)
 *   - forecastYears: Number of years to forecast
 *   - optionalGrowthRate: If provided, overrides the calculated revenue CAGR
 *
 * Output:
 *   - Array of forecasted FCFs for each year
 *
 * Why?
 *   - This approach is standard in equity research when explicit analyst FCFs are not available.
 *   - It provides a reasonable, data-driven fallback for DCF models, improving robustness and transparency.
 *   - The logic is similar to what is used by platforms like Simply Wall St and many sell-side analysts.
 */

export type HistoricalDatum = {
  REVENUE: number;
  FCF: number;
};

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 */
function calcCAGR(begin: number, end: number, periods: number): number {
  if (begin <= 0 || end <= 0 || periods <= 0) return 0;
  return Math.pow(end / begin, 1 / periods) - 1;
}

/**
 * Forecast FCFs using historical FCF margin and revenue growth
 */
export function forecastFCFs(
  historicalData: HistoricalDatum[],
  forecastYears: number,
  overrideGrowthRate?: number
): number[] {
  if (!historicalData || historicalData.length < 2) return Array(forecastYears).fill(0);

  // Extract historical revenue and FCF arrays
  const revenues = historicalData.map(d => typeof d.REVENUE === 'number' ? d.REVENUE : 0);
  const fcfs = historicalData.map(d => typeof d.FCF === 'number' ? d.FCF : 0);

  // Calculate average FCF margin
  const margins = revenues.map((rev, i) => rev > 0 ? fcfs[i] / rev : 0).filter(m => m > 0 && isFinite(m));
  const avgMargin = margins.length > 0 ? margins.reduce((a, b) => a + b, 0) / margins.length : 0.05; // Default 5%

  // Calculate revenue CAGR
  const revBegin = revenues[0];
  const revEnd = revenues[revenues.length - 1];
  const periods = revenues.length - 1;
  const cagr = overrideGrowthRate !== undefined ? overrideGrowthRate : calcCAGR(revBegin, revEnd, periods);

  // Forecast future revenues
  const lastRevenue = revEnd;
  const forecastedRevenues = Array.from({ length: forecastYears }, (_, i) => lastRevenue * Math.pow(1 + cagr, i + 1));

  // Forecast FCFs by applying margin
  const forecastedFCFs = forecastedRevenues.map(rev => rev * avgMargin);

  return forecastedFCFs;
}

/**
 * Example:
 *
 * const hist = [
 *   { REVENUE: 1000, FCF: 50 },
 *   { REVENUE: 1100, FCF: 60 },
 *   { REVENUE: 1200, FCF: 70 },
 * ];
 * const fcfForecast = forecastFCFs(hist, 5);
 * // Returns array of 5 forecasted FCFs
 */
