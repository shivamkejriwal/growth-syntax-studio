// Import all sample data JSON files as modules
import gainers from './sample-data/gainers.json';
import decliners from './sample-data/decliners.json';
import quotes from './sample-data/quotes.json';
import trades from './sample-data/trades.json';
import bars from './sample-data/bars.json';
import tradingActions from './sample-data/trading-actions.json';
import lastTrade from './sample-data/last-trade.json';
import lastSale from './sample-data/last-sale.json';
import statistics from './sample-data/statistics.json';
import fundamentalSummary from './sample-data/fundamental-summary.json';
import fundamentalDetails from './sample-data/fundamental-details.json';
import balanceSheet from './sample-data/balance-sheet.json';
import cashFlowStatement from './sample-data/cash-flow-statement.json';
import incomeStatement from './sample-data/income-statement.json';
import referenceData from './sample-data/reference-data.json';
import mostActiveByVolume from './sample-data/most-active-by-volume.json';
import mostActiveByDollarVolume from './sample-data/most-active-by-dollar-volume.json';

export const SAMPLE_DATA_TABLES = {
  GAINERS: gainers,
  DECLINERS: decliners,
  QUOTES: quotes,
  TRADES: trades,
  BARS: bars,
  TRADING_ACTIONS: tradingActions,
  LAST_TRADE: lastTrade,
  LAST_SALE: lastSale,
  STATISTICS: statistics,
  FUNDAMENTAL_SUMMARY: fundamentalSummary,
  FUNDAMENTAL_DETAILS: fundamentalDetails,
  BALANCE_SHEET: balanceSheet,
  CASH_FLOW_STATEMENT: cashFlowStatement,
  INCOME_STATEMENT: incomeStatement,
  REFERENCE_DATA: referenceData,
  MOST_ACTIVE_BY_VOLUME: mostActiveByVolume,
  MOST_ACTIVE_BY_DOLLAR_VOLUME: mostActiveByDollarVolume,
};

/**
 * Fetches sample data for a given table and optional filter (e.g., ticker).
 * @param table The logical table name from SAMPLE_DATA_TABLES
 * @param filter Optional filter object, e.g., { ticker: 'AAPL' }
 * @returns Promise<any[]> Array of data rows
 */
export async function getSampleData({
  table,
  filter,
}: {
  table: keyof typeof SAMPLE_DATA_TABLES;
  filter?: Record<string, string | number>;
}): Promise<any[]> {
  const data: any[] = SAMPLE_DATA_TABLES[table] as any[];
  if (!data) throw new Error(`Invalid table: ${table}`);
  if (filter) {
    return data.filter((row: any) =>
      Object.entries(filter).every(([key, value]) => row[key] === value)
    );
  }
  return data;
}

/**
 * Fetches sample data for a given ticker, table, and date (API similar to getEquitiesTickers).
 * @param ticker The stock symbol (e.g., 'MSFT')
 * @param table The logical table name from SAMPLE_DATA_TABLES (e.g., 'FUNDAMENTAL_DETAILS')
 * @param date The end date (YYYY-MM-DD) for the data (optional, filters by date/calendardate if present in data)
 * @param range Optional. The range of data to fetch (not used, for API compatibility)
 * @returns Promise<any[]> Array of data rows
 */
export async function getSampleEquitiesTickers({
  ticker,
  table,
  date,
  range = '1Q',
}: {
  ticker: string;
  table: keyof typeof SAMPLE_DATA_TABLES;
  date?: string;
  range?: string;
}): Promise<any[]> {
  let filter: Record<string, string> = {};
  if (ticker) filter.symbol = ticker;
  // Try both 'date' and 'calendardate' as keys for date filtering
  if (date) filter.date = date;
  // Some tables use 'calendardate' instead of 'date'
  // We'll filter on both if present in the data
  let data = SAMPLE_DATA_TABLES[table] as any[];
  if (!data) throw new Error(`Invalid table: ${table}`);
  if (Object.keys(filter).length > 0) {
    data = data.filter(row => {
      let match = true;
      if (filter.symbol && row.symbol !== filter.symbol) match = false;
      if (filter.date && !(row.date === filter.date || row.calendardate === filter.date)) match = false;
      return match;
    });
  }
  return data;
}
