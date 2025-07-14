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

function sortBarDataByDate(barData: BarDataItem[]): BarDataItem[] {
  return [...barData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function getStockPriceHistory(sortedBarData: BarDataItem[]) {
  return sortedBarData.map(item => ({ date: item.date, price: item.close }));
}

function getFinancialHealth(balanceSheetData: BalanceSheetItem[]) {
  return balanceSheetData.map(item => ({
    year: item.calendardate.substring(0, 4),
    debt: item.debt,
    equity: item.equity,
  }));
}

function getQuarterlyEarnings(incomeStatementData: IncomeStatementItem[]) {
  const sorted = [...incomeStatementData].sort((a, b) => new Date(a.calendardate).getTime() - new Date(b.calendardate).getTime());
  return sorted.map(item => ({
    quarter: getQuarterFromDate(item.calendardate),
    revenue: item.revenue,
    netIncome: item.netinc
  }));
}

function getAnnualBarData(sortedBarData: BarDataItem[]) {
  const barsByYearMonth: Record<string, BarDataItem[]> = {};
  sortedBarData.forEach(bar => {
    const date = new Date(bar.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${month}`;
    if (!barsByYearMonth[key]) barsByYearMonth[key] = [];
    barsByYearMonth[key].push(bar);
  });
  const annualBarData: BarDataItem[] = [];
  const years = Array.from(new Set(sortedBarData.map(bar => new Date(bar.date).getFullYear())));
  years.forEach(year => {
    const decemberBars = barsByYearMonth[`${year}-11`];
    if (decemberBars && decemberBars.length > 0) {
      const sorted = decemberBars.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      annualBarData.push(sorted[sorted.length - 1]);
    }
  });
  return annualBarData;
}

function getDividendChartData(annualIncome: IncomeStatementItem[]) {
  return annualIncome.map(incomeItem => {
    const year = incomeItem.calendardate.substring(0, 4);
    const dps = incomeItem.dps ?? 0;
    return { year, dps };
  });
}

function getDividendMetrics(annualIncome: IncomeStatementItem[], rawBalanceSheetData: BalanceSheetItem[], annualCashFlow: CashFlowStatementItem[], dividendChartData: Array<{ year: string; dps: number }>) {
  const historicalDps = dividendChartData.map(d => ({ year: d.year, value: d.dps }));
  const retainedEarningsByYear: Array<{ year: string; value: number | null }> = rawBalanceSheetData
    .filter(item => item.reporttype === 'AR')
    .map(item => ({ year: item.calendardate.substring(0, 4), value: (item as any).retainedearnings ?? null }));
  const latestNcfo = annualCashFlow.length > 0 ? annualCashFlow[annualCashFlow.length - 1].ncfo ?? 0 : 0;
  const latestDividendsPaid = annualCashFlow.length > 0 ? Math.abs(annualCashFlow[annualCashFlow.length - 1].ncfcommon ?? 0) : 0;
  const latestCurrentRatio = rawBalanceSheetData.length > 0 ? (rawBalanceSheetData[rawBalanceSheetData.length - 1].assets ?? 0) / (rawBalanceSheetData[rawBalanceSheetData.length - 1].liabilities ?? 1) : 0;
  const latestDebtToEquity = rawBalanceSheetData.length > 0 ? (rawBalanceSheetData[rawBalanceSheetData.length - 1].debt ?? 0) / (rawBalanceSheetData[rawBalanceSheetData.length - 1].equity ?? 1) : 0;
  const latestPayoutRatio = annualIncome.length > 0 && annualIncome[annualIncome.length - 1].netinc !== 0 ? latestDividendsPaid / Math.abs(annualIncome[annualIncome.length - 1].netinc ?? 1) : 0;
  const latestDps = dividendChartData.length > 0 ? dividendChartData[dividendChartData.length - 1].dps : 0;
  const dividendMetricsRaw = Finance.calculateDividendScorecard({
    historicalDps,
    historicalRetainedEarnings: retainedEarningsByYear,
    latestNcfo,
    latestDividendsPaid,
    latestCurrentRatio,
    latestDebtToEquity,
    latestPayoutRatio,
    latestDividendYield: latestDps,
  });
  return [
    { label: "Score", value: dividendMetricsRaw.score?.toString() ?? "-" },
    { label: "Safety", value: dividendMetricsRaw.safety?.toString() ?? "-" },
    { label: "Dividend History", value: dividendMetricsRaw.dividendHistory?.toString() ?? "-" },
    { label: "Increasing Dividends", value: dividendMetricsRaw.increasingDividends?.toString() ?? "-" },
    { label: "Stability", value: dividendMetricsRaw.stability?.toString() ?? "-" },
    { label: "Dividend DPS", value: latestDps?.toString() ?? "-", isPercentage: false },
  ];
}

function getManagementAllocation(annualCashFlow: CashFlowStatementItem[], annualIncome: IncomeStatementItem[]) {
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
  return combinedFinancials.map(item => {
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
}

const processSharePriceVsFairValueData = (
  rawBarData: BarDataItem[],
  rawBalanceSheetData: BalanceSheetItem[],
  rawIncomeStatementData: IncomeStatementItem[],
  rawCashFlowData: CashFlowStatementItem[],
  companyData: { ticker: string; name: string; sector?: string; currencySymbol?: string }
) => {
  // Get latest price from last bar
  const latestBar = rawBarData.length > 0 ? rawBarData[rawBarData.length - 1] : undefined;
  const currentPrice = latestBar ? latestBar.close : 0;
  console.log('[sk]latestBar', latestBar);
  // Prepare fundamentals for DCF
  // Merge balance sheet, income statement, and cash flow for each period
  const fundamentals: any[] = rawIncomeStatementData.map((income, idx) => {
    const balance = rawBalanceSheetData[idx] || {};
    const cashflow = rawCashFlowData[idx] || {};
    return {
      ...income,
      ...balance,
      ...cashflow,
    };
  });

  // Use sector if available
  const profile = { sector: companyData.sector || '', ticker: companyData.ticker, name: companyData.name };
  // DCF config: 5 years, 10% discount rate, 2.5% perpetual growth
  // Use analyst scenario inputs for DCF calculation
  const analystDiscountRate = 7.7; // Cost of Equity from S&P Global
  const analystPerpetualGrowthRate = 2.9; // US 5-Year Avg Govt Bond Rate
  // Example: explicit analyst FCFs (replace with real analyst estimates if available)
  const fairValue = Finance.evaluateDCF(
    profile,
    fundamentals,
    5, // timeFrame matches number of explicit FCFs
    analystDiscountRate,
    analystPerpetualGrowthRate,
    undefined, // estimatedGrowthRatePercent not needed if explicitFCFs provided
    undefined
  );

  // Thresholds (20% default)
  const undervaluedThresholdPercent = 20;
  const overvaluedThresholdPercent = 20;

  console.log(`Current Price: ${currentPrice}, Fair Value: ${fairValue}`);
  return {
    currentPrice,
    fairValue,
    undervaluedThresholdPercent,
    overvaluedThresholdPercent,
    currencySymbol: companyData.currencySymbol || '$',
  };
};

export const processFetchedEquityData = (
  rawBarData: BarDataItem[],
  rawBalanceSheetData: BalanceSheetItem[],
  rawIncomeStatementData: IncomeStatementItem[],
  rawCashFlowData: CashFlowStatementItem[],
  companyData?: { ticker: string; name: string; sector?: string; currencySymbol?: string }
): ProcessedEquityData => {
  const sortedRawBarData = sortBarDataByDate(rawBarData);
  const stockPriceHistory = getStockPriceHistory(sortedRawBarData);
  const financialHealth = getFinancialHealth(rawBalanceSheetData);
  const quarterlyEarnings = getQuarterlyEarnings(rawIncomeStatementData);
  const annualCashFlow = rawCashFlowData.filter(item => item.reporttype === 'AR');
  const annualIncome = rawIncomeStatementData.filter(item => item.reporttype === 'AR');
  const dividendChartData = getDividendChartData(annualIncome);
  const dividendMetrics = getDividendMetrics(annualIncome, rawBalanceSheetData, annualCashFlow, dividendChartData);
  const managementAllocation = getManagementAllocation(annualCashFlow, annualIncome);
  const sharePriceVsFairValueData = processSharePriceVsFairValueData(
    sortedRawBarData,
    rawBalanceSheetData,
    rawIncomeStatementData,
    rawCashFlowData,
    companyData || { ticker: '', name: '', sector: '', currencySymbol: '$' }
  );
  return {
    stockPriceHistory,
    financialHealth,
    quarterlyEarnings,
    managementAllocation,
    dividendChartData,
    dividendMetrics,
    sharePriceVsFairValueData,
  };
};