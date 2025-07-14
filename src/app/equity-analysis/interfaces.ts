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
  symbol: string; // The stock ticker symbol for the company.
  calendardate: string; // e.g., "2021-12-31"
  debt: number; // Total debt, including both short-term and long-term obligations.
  equity: number; // Total shareholders' equity.
  assets: number; // Total assets of the company.
  reporttype?: string; // The type of report (e.g., 'AR' for Annual Report, 'AQ' for Annual Q-report).
  currency?: string; // The currency in which the financial figures are reported (e.g., "USD").
  bvps?: number; // Book Value Per Share.
  cashneq?: number; // Cash and cash equivalents.
  liabilities?: number; // Total liabilities of the company.
  investmentsnc?: number; // Non-current investments.
  receivables?: number; // Accounts receivable, representing money owed to the company by its customers.
  inventory?: number; // The value of the company's inventory.
  ppnenet?: number; // Net Property, Plant, and Equipment.
  intangibles?: number; // Intangible assets, such as goodwill, patents, and trademarks.
  tangibles?: number; // Total tangible assets.
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
  dps?: number | null; // Dividends Per Share (added for correct dividend chart logic)
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
  dividendChartData: Array<{ year: string; dps: number }>;
  dividendMetrics: Array<{ label: string; value: string; isPercentage?: boolean }>;
  sharePriceVsFairValueData: {
    currentPrice: number;
    fairValue: number;
    undervaluedThresholdPercent: number;
    overvaluedThresholdPercent: number;
    currencySymbol: string;
  };
}

export interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subValue?: string;
}