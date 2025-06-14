import Finance from "@/math/finance"; // Import utility function for cash allocation data
import {
  BarDataItem,
  BalanceSheetItem,
  IncomeStatementItem,
  CashFlowStatementItem,
  ProcessedEquityData,
} from "./interfaces";

export const getQuarterFromDate = (dateString: string): string => {
  const date = new Date(dateString);
  const quarter = Math.floor((date.getMonth() + 3) / 3);
  return `Q${quarter} ${date.getFullYear()}`;
};

export const processFetchedEquityData = (
  rawBarData: BarDataItem[],
  rawBalanceSheetData: BalanceSheetItem[],
  rawIncomeStatementData: IncomeStatementItem[],
  rawCashFlowData: CashFlowStatementItem[]
): ProcessedEquityData => {
  // Process Stock Price History Data
  const stockPriceHistory = rawBarData.map(item => ({
    date: item.date,
    price: item.close,
  }));

  // Process Financial Health Data
  const financialHealth = rawBalanceSheetData.map(item => ({
    year: item.calendardate.substring(0, 4),
    debt: item.debt,
    equity: item.equity,
  }));

  // Process Quarterly Earnings Data
  const sortedRawIncomeStatementData = [...rawIncomeStatementData].sort(
    (a, b) => new Date(a.calendardate).getTime() - new Date(b.calendardate).getTime()
  );
  const quarterlyEarnings = sortedRawIncomeStatementData.map(item => ({
    quarter: getQuarterFromDate(item.calendardate),
    revenue: item.revenue,
    netIncome: item.netinc,
  }));

  // Process Management Allocation Data
  const annualCashFlow = rawCashFlowData.filter(item => item.reporttype === 'AR');
  const annualIncome = rawIncomeStatementData.filter(item => item.reporttype === 'AR');

  const combinedFinancials = annualCashFlow.map(cfItem => {
    const year = cfItem.calendardate.substring(0, 4);
    const incomeItem = annualIncome.find(
      incItem => incItem.calendardate.substring(0, 4) === year
    );
    return {
      year: year,
      ncfi: cfItem.ncfi || 0,
      capexReported: cfItem.capex !== undefined ? Math.abs(cfItem.capex) : 0,
      rndReported: (incomeItem && incomeItem.rnd) || 0,
    };
  });

  combinedFinancials.sort((a, b) => parseInt(a.year) - parseInt(b.year));

  const managementAllocation = combinedFinancials.map(item => {
    const allocation = Finance.getCashAllocationData({
      NCFI: item.ncfi,
      CAPEX: item.capexReported,
      RND: item.rndReported,
    });
    return {
      year: item.year,
      research: allocation.rnd,
      production: allocation.capex,
      acquisitions: allocation.acquisitions,
    };
  });

  return {
    stockPriceHistory,
    financialHealth,
    quarterlyEarnings,
    managementAllocation,
  };
};