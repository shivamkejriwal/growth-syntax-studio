import { Utils } from './utils';
import { forecastFCFs, HistoricalDatum } from './forecastFCFs';

// Present Value (PV)
const PV = (ratePercent: number, cf1: number, numOfPeriod?: number): number => {
  numOfPeriod = typeof numOfPeriod !== 'undefined' ? numOfPeriod : 1;
  const rate = ratePercent / 100;
  const pv = cf1 / Math.pow((1 + rate), numOfPeriod);
  return Utils.round(pv, 2);
};

// Future Value (FV)
const FV = (ratePercent: number, cf0: number, numOfPeriod: number): number => {
  const rate = ratePercent / 100;
  const fv = cf0 * Math.pow((1 + rate), numOfPeriod);
  return Utils.round(fv, 2);
};

// Terminal Value (TV)
const TV = (longTermRatePercent: number, discountRatePercent: number, finalCF: number): number => {
  const longTermRate = longTermRatePercent / 100;
  const discountRate = discountRatePercent / 100;
  return Math.round(finalCF * (1 + longTermRate) / (discountRate - longTermRate));
};

const Forcast = (rate: number, value: number, time: number): number[] => {
  let results: number[] = [];
  for (let period = 0; period <= time; period++) {
    results.push(FV(rate, value, period));
  }
  return results;
};

const seekZero = (fn: (x: number) => number): number => {
  let x = 1;
  while (fn(x) > 0) {
    x += 1;
  }
  while (fn(x) < 0) {
    x -= 0.01;
  }
  return x + 0.01;
};

const IRR = (cfs: number[]): number => {
  const args = cfs;
  let numberOfTries = 1;
  let positive = false, negative = false;
  Array.prototype.slice.call(args).forEach(function (value: number) {
    if (value > 0) positive = true;
    if (value < 0) negative = true;
  });
  if (!positive || !negative) throw new Error('IRR requires at least one positive value and one negative value');
  function npv(rate: number): number {
    numberOfTries++;
    if (numberOfTries > 1000) {
      throw new Error('IRR can\'t find a result');
    }
    const rrate = (1 + rate / 100);
    let npv = args[0];
    for (let i = 1; i < args.length; i++) {
      npv += (args[i] / Math.pow(rrate, i));
    }
    return npv;
  }
  return Utils.round(seekZero(npv), 2);
};

const CAGR = (beginningValue: number, endingValue: number, numOfPeriods: number): number => {
  const cagr = Math.pow((endingValue / beginningValue), 1 / numOfPeriods) - 1;
  return Math.round(cagr * 10000) / 100;
};

const growthRates = (list: number[]): number[] => {
  let rates: number[] = [];
  const last = list.length - 1;
  for (let period = 1; period < list.length; period++) {
    for (let time = 0; time < last; time = time + period) {
      const endIndex = ((time + period) > last) ? last : time + period;
      const begin = list[time];
      const end = list[endIndex];
      const periods = endIndex - time;
      const growth = CAGR(begin, end, period);
      rates.push(growth);
    }
  }
  return rates;
};

type Fundamental = Record<string, number>;

type Profile = { sector: string };

// Calculate Free Cash Flow to Firm (FCFF) for the most recent period (Year 0)
// Option 1: From Net Income components
const calculateFCFFYear0FromNI = (currentData: Fundamental, prevData: Fundamental): number => {
    const netIncome = currentData.NETINC || 0;
    const depAmor = currentData.DEPAMOR || 0; // Non-cash charge
    const capex = currentData.CAPEX || 0;     // Magnitude of capital expenditure (FCInv)

    // Investment in Working Capital = Change in (Current Assets - Current Liabilities)
    // Note: Ensure ASSETSC and LIABILITIESC are *non-cash* current assets and *non-interest-bearing* current liabilities for strict WC.
    // For simplicity, using total current assets and liabilities if specific breakdowns aren't available.
    const currentWorkingCapital = (currentData.ASSETSC || 0) - (currentData.LIABILITIESC || 0);
    const previousWorkingCapital = (prevData.ASSETSC || 0) - (prevData.LIABILITIESC || 0);
    const investmentInWorkingCapital = currentWorkingCapital - previousWorkingCapital;

    // FCFF = NI + NCC (like D&A) - FCInv (Capex) - WCInv
    const fcff = netIncome + depAmor - capex - investmentInWorkingCapital;
    return fcff;
};

// Option 2: From Cash Flow from Operations (often more direct)
const calculateFCFFYear0FromCFO = (currentData: Fundamental): number => {
    const cfo = currentData.NCFO || 0;
    const capex = currentData.CAPEX || 0; // Magnitude of capital expenditure (FCInv)
    // FCFF = CFO - Capex (assuming Capex is a good proxy for FCInv)
    return cfo - capex;
};


// Forecasts FCFF based on revenue growth and historical FCFF/Revenue margin.
// Ensure 'FCF' in historical data (used for fcfOverTime) is FCFF.
const forecastFCFFFromRevenue = (fundamentals: Fundamental[], timeFrame: number, estimatedGrowthRate?: number): number[] => {
  const list = fundamentals;
  const revenueOverTime = Utils.reduce(list, 'REVENUE', (val: number) => val) as number[];
  const fcfOverTime = Utils.reduce(list, 'FCF', (val: number) => val) as number[];
  console.log('DEBUG: forecastFCFFFromRevenue input', {
    fundamentals,
    revenueOverTime,
    fcfOverTime
  });
  const ratios = Utils.combinedOperation(fcfOverTime, revenueOverTime, (a: number, b: number) => Utils.divide(a, b));
  const averageRatio = Utils.average(ratios);

  const revenueGrowthRates = Finance.growthRates(revenueOverTime);
  const revenueGrowth = Utils.average(revenueGrowthRates);
  const growthRate = (estimatedGrowthRate !== undefined) ? estimatedGrowthRate : revenueGrowth;

  const lastRevenue = revenueOverTime.length > 0 ? revenueOverTime[revenueOverTime.length - 1] : 0;
  const forcastedRevenue = Forcast(growthRate, lastRevenue, timeFrame);
  const forcastedFCFF = forcastedRevenue.map(x => x * averageRatio);
  console.log('forcastedCashFromRevenue', {
    revenueGrowthRates,
    revenueGrowth,
    growthRate,
    ratios,
    averageRatio,
    forcastedRevenue,
    forcastedFCFF
  });
  return forcastedFCFF;
};

// Forecasts Dividends Per Share (for DDM)
// This is a more appropriate function for financial institutions if using DDM.
const forecastDividendsPerShare = (fundamentals: Fundamental[], timeFrame: number, estimatedGrowthRate?: number): number[] => {
  const list = fundamentals;
  const dividendPerShareOverTime = Utils.reduce(list, 'DPS', (val: number) => val) as number[];
  const sharesOverTime = Utils.reduce(list, 'SHARESWA', (val: number) => val) as number[];
  const dividendOverTime = Utils.combinedOperation(dividendPerShareOverTime, sharesOverTime, (a: number, b: number) => a * b);

  const fcfOverTime = Utils.reduce(list, 'FCF', (val: number) => val) as number[];
  const ratios = Utils.combinedOperation(fcfOverTime, dividendOverTime, (a: number, b: number) => Utils.divide(a, b));
  const averageRatio = Utils.average(ratios); // This FCF/Dividend ratio is unusual for DDM. DDM projects DPS directly.

  const dividendGrowthRates = Finance.growthRates(dividendOverTime);
  const dividendGrowth = Utils.average(dividendGrowthRates);
  const growthRate = (estimatedGrowthRate !== undefined) ? estimatedGrowthRate : dividendGrowth;

  const lastDividend = dividendOverTime.length > 0 ? dividendOverTime[dividendOverTime.length - 1] : 0;
  const forcastedDividend = Forcast(growthRate, lastDividend, timeFrame);

  // For DDM, we need DPS. If 'dividendPerShareOverTime' is available and reliable:
  const lastDPS = dividendPerShareOverTime.length > 0 ? dividendPerShareOverTime[dividendPerShareOverTime.length -1] : 0;
  const forecastedDPSArray = Forcast(growthRate, lastDPS, timeFrame);
  console.log('forecastDividendsPerShare (used for DDM)', {
    estimatedGrowthRate,
    dividendGrowthRates,
    dividendGrowth,
    growthRate,
    ratios,
    averageRatio,
    forcastedDividend,
    forecastedDPSArray // DPS
  });
  // If DDM, return forecastedDPSArray. The existing logic returns a FCF-like value.
  // For now, returning the DPS array for a potential DDM path.
  return forecastedDPSArray; 
};

const getPresentValueOfForecastPeriod = (
    discountRate: number,
    cashFlows: number[], // Expected: [CF0, CF1, ..., CF_N]
    timeFrame: number   // N
  ): { total: number, values: number[] } => {
  let pvValues: number[] = [];
  // We discount cash flows from year 1 to timeFrame (cashFlows[1] to cashFlows[timeFrame])
  if (cashFlows.length <= 1) {
      return { total: 0, values: [] };
  }
  for (let year = 1; year <= timeFrame; year++) {
    if (year < cashFlows.length) {
        const futureValue = cashFlows[year];
        const presentValue = PV(discountRate, futureValue, year);
        pvValues.push(presentValue);
    } else {
        // If timeFrame is longer than available cashFlows (excluding CF0)
        break; 
    }
  }
  const total = pvValues.reduce((sum, value) => sum + value, 0); // Corrected initial value to 0
  return {
    total,
    values: pvValues
  };
};

const getFairValueFromEnterpriseValue = (
    enterpriseValue: number,
    currentData: Fundamental, // Last period's fundamental data
    options?: { isFCFE?: boolean } // Add option to skip net debt for FCFE
  ): number => {
  const sharesOutstanding = currentData.SHARESWA || 0;
  if (sharesOutstanding === 0) return 0;

  if (options?.isFCFE) {
    // For FCFE, enterpriseValue is already equity value
    const fairValuePerShare = Utils.round(enterpriseValue / sharesOutstanding, 2);
    console.log('getFairValueFromEnterpriseValue (FCFE)', {
      enterpriseValue,
      sharesOutstanding,
      fairValuePerShare
    });
    return fairValuePerShare;
  }

  // Net Debt = Total Debt - Cash & Cash Equivalents
  const totalDebt = currentData.DEBT || 0; // Assuming DEBT is total debt
  const cashAndEquivalents = currentData.CASHNEQ || 0; // Assuming CASHNEQ is cash & equivalents
  const netDebt = totalDebt - cashAndEquivalents;

  const equityValue = enterpriseValue - netDebt;
  const fairValuePerShare = Utils.round(equityValue / sharesOutstanding, 2);
  console.log('getFairValueFromEnterpriseValue (FCFF)', {
    enterpriseValue,
    totalDebt,
    cashAndEquivalents,
    netDebt,
    equityValue,
    sharesOutstanding,
    fairValuePerShare
  });
  return fairValuePerShare;
};

// Helper: Map Nasdaq fields to internal keys for DCF logic
function mapNasdaqFundamentalToInternal(raw: Record<string, any>): Fundamental {
  return {
    REVENUE: raw.revenue ?? 0,
    FCF: raw.fcf ?? 0,
    NCFO: raw.ncfo ?? 0,
    CAPEX: raw.capex ?? 0,
    SHARESWA: raw.shareswa ?? 0,
    DEBT: raw.debt ?? 0,
    CASHNEQ: raw.cashneq ?? 0,
    NETINC: raw.netinc ?? 0,
    DEPAMOR: raw.depamor ?? 0,
    ASSETSC: raw.assetsc ?? 0,
    LIABILITIESC: raw.liabilitiesc ?? 0,
    DPS: raw.dps ?? 0,
    // Add more fields as needed
  };
}

const evaluateDCF = (
  profile: Profile,
  fundamentals: Fundamental[],
  timeFrame: number,
  discountRatePercent: number, // WACC for FCFF model, Cost of Equity for DDM
  perpetualGrowthRatePercent: number, // Renamed from riskFreeRate for clarity
  estimatedGrowthRatePercent?: number, // Growth rate for FCF projection period
  explicitFCFs?: number[] // NEW: Explicit analyst FCFs override
): number => {
  // Map raw fundamentals to internal keys
  const mappedFundamentals = fundamentals.map(mapNasdaqFundamentalToInternal);
  const list = mappedFundamentals;
  const currentData = Utils.getLastObject(list);
  const prevData = Utils.getSecondLastObject(list);

  console.log('DEBUG: evaluateDCF input', {
    profile,
    fundamentals: list,
    currentData,
    prevData
  });

  let projectedCashFlows: number[];
  let fairValue: number;

  if (profile.sector !== 'Financial') {
    // Use explicitFCFs if provided and valid, else use forecastFCFs
    const validExplicitFCFs = Array.isArray(explicitFCFs) && explicitFCFs.filter(x => typeof x === 'number' && !isNaN(x));
    if (validExplicitFCFs && validExplicitFCFs.length > 0) {
      projectedCashFlows = validExplicitFCFs;
      console.log('DEBUG: Using explicitFCFs for DCF', { explicitFCFs: validExplicitFCFs });
    } else {
      // Use forecastFCFs as the default fallback
      const historicalData: HistoricalDatum[] = mappedFundamentals.map(f => ({
        REVENUE: typeof f.REVENUE === 'number' ? f.REVENUE : 0,
        FCF: typeof f.FCF === 'number' ? f.FCF : 0
      }));
      console.log('DEBUG: historicalData for forecastFCFs', { historicalData });
      projectedCashFlows = forecastFCFs(historicalData, timeFrame, estimatedGrowthRatePercent);
      console.log('DEBUG: Using forecastFCFs fallback for DCF', { forecastedFCFs: projectedCashFlows });
    }
    if (!projectedCashFlows || projectedCashFlows.length === 0 || projectedCashFlows.every(x => x === 0)) {
      console.warn('DCF: No valid projected cash flows provided. Returning fair value 0.');
      return 0;
    }
    // Debug: Print analyst FCFs and shares outstanding
    console.log('DEBUG: DCF Inputs (Analyst FCF)', {
      projectedCashFlows,
      sharesOutstanding: currentData.SHARESWA,
      discountRatePercent,
      perpetualGrowthRatePercent
    });
    const pvForecastPeriod = getPresentValueOfForecastPeriod(discountRatePercent, projectedCashFlows, timeFrame);
    // Use last valid FCF for terminal value
    let terminalFCFE = projectedCashFlows[projectedCashFlows.length - 1];
    if (typeof terminalFCFE !== 'number' || isNaN(terminalFCFE)) {
      // Fallback: find last valid number in array
      terminalFCFE = projectedCashFlows.reverse().find(x => typeof x === 'number' && !isNaN(x)) || 0;
      projectedCashFlows.reverse(); // Restore order
      console.warn('DCF: Terminal FCF was invalid, using fallback value:', terminalFCFE);
    }
    const terminalValueAtN = TV(perpetualGrowthRatePercent, discountRatePercent, terminalFCFE);
    const pvTerminalValue = PV(discountRatePercent, terminalValueAtN, timeFrame);
    const equityValue = pvForecastPeriod.total + pvTerminalValue;
    console.log('DEBUG: DCF Equity Value', {
      pvForecastPeriod,
      terminalFCFE,
      terminalValueAtN,
      pvTerminalValue,
      equityValue
    });
    fairValue = getFairValueFromEnterpriseValue(equityValue, currentData, { isFCFE: true });
  } else {
    // Dividend Discount Model (DDM) for Financials (discountRate should be Cost of Equity)
    console.warn("Using DDM for Financial sector. Ensure 'discountRatePercent' is Cost of Equity and 'fundamentals' contain 'DPS'.");
    projectedCashFlows = forecastDividendsPerShare(list, timeFrame, estimatedGrowthRatePercent); // This returns DPS: [DPS0, DPS1, ..., DPSN]
    console.log('DEBUG: projectedCashFlows (DDM)', projectedCashFlows);
    // DPS0 is last historical DPS
    if (projectedCashFlows.length === 0) { return 0; }

    const pvForecastPeriod = getPresentValueOfForecastPeriod(discountRatePercent, projectedCashFlows, timeFrame);
    const terminalDPS = projectedCashFlows[timeFrame];
    const terminalValueAtN = TV(perpetualGrowthRatePercent, discountRatePercent, terminalDPS); // TV of DPS
    const pvTerminalValue = PV(discountRatePercent, terminalValueAtN, timeFrame);
    // For DDM, the sum of PV of DPS and PV of Terminal DPS gives intrinsic value per share directly
    fairValue = Utils.round(pvForecastPeriod.total + pvTerminalValue, 2);
  }

  console.log('DCF', {
    profileSector: profile.sector,
    discountRatePercent,
    perpetualGrowthRatePercent,
    projectedCashFlows, // [CF0, CF1, ..., CFN]
    fairValue
  });
  return fairValue;
};

const getCashAllocationData = (data: {
    NCFI?: number; //Net Cash Flow from Investing
    CAPEX?: number; //Capital Expenditures
    RND?: number; //Research and Development
}): { capex: number; rnd: number; acquisitions: number } => {
    // NCFI is raw (e.g., -100 for an outflow)
    // CAPEX is abs(reported_capex) (e.g., 60, from a reported -60)
    // RND is reported R&D expense (e.g., 20)
    const { NCFI = 0, CAPEX = 0, RND = 0 } = data; 

    const capexInvestment = CAPEX; // Already positive magnitude
    const rndInvestment = RND;     // Typically positive expense

    // Derive acquisitions investment:
    // abs(NCFI) is the total net outflow from investing activities.
    // If this total net outflow is greater than capex outflow,
    // the difference is attributed to net acquisitions.
    // Otherwise, acquisitions are considered 0 for this allocation.
    const totalNetInvestingOutflow = Math.abs(NCFI);
    const acquisitionsInvestment = Math.max(0, totalNetInvestingOutflow - capexInvestment);

    const totalAllocationBase = capexInvestment + rndInvestment + acquisitionsInvestment;

    if (totalAllocationBase === 0) {
        return { capex: 0, rnd: 0, acquisitions: 0 };
    }

    const capexPercentage = Utils.round((capexInvestment / totalAllocationBase) * 100, 2);
    const rndPercentage = Utils.round((rndInvestment / totalAllocationBase) * 100, 2);
    const acquisitionsPercentage = Utils.round((acquisitionsInvestment / totalAllocationBase) * 100, 2);

    return {
        capex: capexPercentage, //production
        rnd: rndPercentage, //research
        acquisitions: acquisitionsPercentage //acquisitions
    };
}

// Define an interface for the structured input of buildDividendAnalysis
interface DividendAnalysisMetrics {
  historicalDps: Array<{ year: string; value: number | null }>; // Array of Dividend Per Share per year
  historicalRetainedEarnings: Array<{ year: string; value: number | null }>; // Array of Retained Earnings per year
  latestNcfo: number; // Latest Net Cash Flow from Operations
  latestDividendsPaid: number;  // Latest total dividends paid (absolute value)
  latestCurrentRatio: number; // Latest Current Ratio
  latestDebtToEquity: number; // Latest Debt to Equity Ratio
  latestPayoutRatio: number;  // Latest Payout Ratio
  latestDividendYield: number;  // Latest Dividend Yield (as a decimal, e.g., 0.03 for 3%)
}

const calculateDividendScorecard = ({
  historicalDps,
  historicalRetainedEarnings,
  latestNcfo,
  latestDividendsPaid,
  latestCurrentRatio,
  latestDebtToEquity,
  latestPayoutRatio,
  latestDividendYield,
}: DividendAnalysisMetrics) => {
  const analysis = {
    score: 0,
    safety: 0,
    stability: 0,
    increasingDividends: 0,
    dividendHistory: 0,
    DIVYIELD: 0,
  };

  const dps = historicalDps.map(item => item.value ?? 0); // Extract DPS values, defaulting null to 0
  const retainedEarnings = historicalRetainedEarnings.map(item => item.value ?? 0); // Extract Retained Earnings values, defaulting null to 0
  const cleanDps = Utils.cleanSeries(dps);
  const change = Utils.change(cleanDps, true);
  const years = dps.length;

  // --- Safety Metrics Scoring (0 to 1 scale, 1 is best) ---

  // 1. Payout Ratio Score
  let payoutScore: number;
  if (latestPayoutRatio < 0 || latestPayoutRatio > 1.0) { // Paying more than earnings or negative payout
    payoutScore = 0;
  } else {
    // Higher score for lower payout ratio (e.g., 0% payout = score 1; 100% payout = score 0)
    payoutScore = 1.0 - latestPayoutRatio;
  }

  // 2. Current Ratio Score
  // Target a current ratio of 2.0 for a full score, scales linearly below that.
  const currentRatioScore = (latestCurrentRatio < 0) ? 0 : Math.min(1, latestCurrentRatio / 2.0);

  // 3. CFO Coverage Score (Net Cash Flow from Operations / Dividends Paid)
  let cfoCoverageScore: number;
  if (latestDividendsPaid <= 0) { // If no dividends paid, coverage is not applicable or max safe.
    cfoCoverageScore = (latestNcfo > 0) ? 1 : 0; // If CFO is positive, it's safe; otherwise, not.
  } else if (latestNcfo <= 0) { // Negative or zero CFO cannot cover positive dividends
    cfoCoverageScore = 0;
  } else {
    const coverageRatio = latestNcfo / latestDividendsPaid;
    // Target 2x coverage for full score.
    cfoCoverageScore = Math.min(1, coverageRatio / 2.0);
  }

  // 4. Debt to Equity Score (Lower D/E is better)
  // Score is 1 if D/E is 0. If D/E is 1, score is 1. If D/E is 2, score is 0.5.
  const debtToEquityScore = (latestDebtToEquity < 0) ? 0 : (latestDebtToEquity === 0 ? 1 : Math.min(1, 1 / latestDebtToEquity));

  // 5. Retained Earnings Growth Consistency
  const dividendIncreases = Utils.monotoneCheck(dps);
  const retainedEarningsGrowthScore = (years > 0) ? Utils.monotoneCheck(retainedEarnings) / years : 0;
  const volatility = change.length > 0 ? Utils.volatility(change) : 1; // Default volatility to 1 (max instability) if no change data
  const safetyList = [payoutScore, currentRatioScore, cfoCoverageScore, debtToEquityScore, retainedEarningsGrowthScore];
  const safety = Utils.weightedAverage(safetyList, [3, 3, 2, 2, 1]);
  const dividendHistory = cleanDps.length/years;
  const increasingDividends = dividendIncreases/years;
  const stability = ((1 - volatility) < 0) ? 0 : 1 - volatility;

  const score = Utils.average([
      safety,
      stability,
      increasingDividends,
      dividendHistory
  ]);
  analysis.score = Utils.round(score, 1) * 10;
  analysis.increasingDividends = Utils.round(increasingDividends, 1) * 10;
  analysis.safety = Utils.round(safety, 1) * 10;
  analysis.stability = Utils.round(stability, 1) * 10;
  analysis.dividendHistory = Utils.round(dividendHistory, 1) * 10;
  analysis.DIVYIELD = Utils.round(latestDividendYield * 100, 2); // Convert yield to percentage
  
  console.log('buildDiv', {
      inputs: {
        latestPayoutRatio, latestCurrentRatio, latestNcfo, latestDividendsPaid, latestDebtToEquity
      },
      scores: {
        payoutScore,
        currentRatioScore,
        cfoCoverageScore,
        debtToEquityScore,
        retainedEarningsGrowthScore
      },
      safetyList,
      dps, cleanDps,
      retainedEarnings,
      change, volatility});
  console.log('buildAnalysis', analysis);
  return analysis; // Ensure the function returns the analysis object
}

// Instantiate a Finance class
const Finance = {
  IRR,
  CAGR,
  FV,
  PV,
  TV,
  evaluateDCF,
  growthRates,
  Forcast, // Note: Consider renaming to 'forecastSeries' or similar for clarity
  getCashAllocationData,
  calculateDividendScorecard
};

export default Finance;
