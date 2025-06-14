// Define an interface for the bar data items (matching bars.json structure)
export interface BarDataItem {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Define an interface for the data format expected by StockPriceHistoryChart
export interface StockPriceHistoryChartItem {
  date: string;
  price: number;
}

// Define an interface for the raw balance sheet data items (matching balance-sheet.json structure)
export interface BalanceSheetItem {
  symbol: string;
  calendardate: string; // e.g., "2021-12-31"
  debt: number;
  equity: number;
  assets: number;
  reporttype?: string;
  currency?: string;
  bvps?: number;
  cashneq?: number;
  liabilities?: number;
  investmentsnc?: number;
  receivables?: number;
  inventory?: number;
  ppnenet?: number;
  intangibles?: number;
  tangibles?: number;
}

// Define an interface for the raw income statement data items (matching income-statement.json structure)
export interface IncomeStatementItem {
  symbol: string;
  calendardate: string; // e.g., "2024-03-31"
  revenue: number;
  cor: number; // Cost of Revenue
  opinc: number; // Operating Income
  eps: number | null; // Earnings Per Share
  ebitda: number | null; // Earnings Before Interest, Taxes, Depreciation, and Amortization
  ebit: number | null; // Earnings Before Interest and Taxes
  gp: number; // Gross Profit
  rnd: number; // Research and Development
  sgna: number; // Selling, General & Administrative
  opex: number; // Operating Expenses
  taxexp: number; // Income Tax Expense
  netinc: number; // Net Income
  shareswa: number | null; // Weighted Average Shares Outstanding
  reporttype?: string;
  currency?: string;
}

// Define an interface for the raw cash flow statement data items
export interface CashFlowStatementItem {
  symbol: string;
  calendardate: string; // e.g., "2021-12-31"
  ncfi?: number;         // Net Cash Flow from Investing
  capex?: number;        // Capital Expenditures (now stored as negative in JSON)
  reporttype?: string;   // AR, AQ etc.
  currency?: string;
  opex?: number;         // Operating Expenses
  ncff?: number;         // Net Cash Flow from Financing
  fcf?: number;          // Free Cash Flow
  ncfo?: number;         // Net Cash Flow from Operations
  sbcomp?: number;       // Stock-Based Compensation
  depamor?: number;      // Depreciation and Amortization
  ncfcommon?: number;    // Net Cash Flow from Common Stock
  ncfinv?: number;       // Net Change in Investments / Other Investing Activities
}

export interface ManagementChartDataPoint {
  year: string;
  research: number;
  production: number;
  acquisitions: number;
}

export interface ProcessedEquityData {
  stockPriceHistory: StockPriceHistoryChartItem[];
  financialHealth: Array<{ year: string; debt: number; equity: number }>;
  quarterlyEarnings: Array<{ quarter: string; revenue: number; netIncome: number }>;
  managementAllocation: ManagementChartDataPoint[];
}

export interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subValue?: string;
}