import 'dotenv/config';
import axios from 'axios';

/**
 * Fetches data from Nasdaq Data Link Equities 360 for a given ticker, table, and date.
 * @param ticker The stock symbol (e.g., 'MSFT')
 * @param table The table code from EQUITIES360_TABLES (e.g., 'FUNDAMENTAL_DETAILS')
 * @param date The end date (YYYY-MM-DD) for the data
 * @param range Optional. The range of data to fetch (e.g., '1Q', '1Y'). Defaults to '1Q' (1 quarter).
 * @returns Promise<any[]> Array of data rows
 */
export async function getEquitiesTickers({
  ticker,
  table,
  date,
  range = '1Q',
}: {
  ticker: string;
  table: keyof typeof EQUITIES360_TABLES;
  date: string;
  range?: string;
}): Promise<any[]> {
  const apiKey = process.env.NASDAQ_API_KEY;
  if (!apiKey) {
    throw new Error('NASDAQ_API_KEY is not set in environment variables');
  }
  const tableCode = EQUITIES360_TABLES[table];
  if (!tableCode) {
    throw new Error(`Invalid table: ${table}`);
  }

  // Build query params
  const params: Record<string, string> = {
    symbol: ticker,
    api_key: apiKey,
  };

  // Add date filter if relevant
  if (date) {
    params['calendardate'] = date;
  }

  // Add range filter if relevant (for tables that support it)
  // For most tables, range is not a direct param, but you can fetch a window of dates if needed.
  // Here, we just pass the end date; you can expand this logic for more advanced range support.

  // Build URL
  const url = `https://data.nasdaq.com/api/v3/datatables/${tableCode}.json`;
  try {
    const response = await axios.get(url, { params });
    const data = response.data;
    if (!data?.datatable?.data) {
      throw new Error('Unexpected response format from Nasdaq Data Link');
    }
    return data.datatable.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Handle 403 Forbidden and other HTTP errors gracefully
        const status = error.response.status;
        const message = error.response.data?.quandl_error?.message || error.response.statusText;
        throw new Error(`Nasdaq Data Link API error (${status}): ${message}`);
      } else if (error.request) {
        throw new Error('No response received from Nasdaq Data Link API.');
      } else {
        throw new Error(`Axios error: ${error.message}`);
      }
    } else {
      throw error;
    }
  }
}

// Nasdaq Equities 360 Table Codes
export const EQUITIES360_TABLES = {
  // Streaming pricing data
  QUOTES: 'NDAQ/SQ',
  TRADES: 'NDAQ/ST',
  TRADING_ACTIONS: 'NDAQ/ACTION',

  // REST API pricing and analytics
  LAST_TRADE: 'NDAQ/LT',
  LAST_QUOTE: 'NDAQ/LQ',
  LAST_SALE: 'NDAQ/SALE',
  BARS: 'NDAQ/BAR',
  TRENDS_GAINERS: 'NDAQ/GAN',
  TRENDS_DECLINERS: 'NDAQ/DEC',
  TRENDS_MOST_ACTIVE_BY_VOLUME: 'NDAQ/TBYV',
  TRENDS_MOST_ACTIVE_BY_DOLLAR_VOLUME: 'NDAQ/TBYDV',

  // Fundamental, corporate actions and reference data
  STATISTICS: 'NDAQ/STAT',
  FUNDAMENTAL_SUMMARY: 'NDAQ/FS',
  FUNDAMENTAL_DETAILS: 'NDAQ/FD',
  BALANCE_SHEET: 'NDAQ/BS',
  CASH_FLOW_STATEMENT: 'NDAQ/CF',
  INCOME_STATEMENT: 'NDAQ/IS',
  REFERENCE_DATA: 'NDAQ/RD',
  CORPORATE_ACTIONS: 'NDAQ/CA',
};
