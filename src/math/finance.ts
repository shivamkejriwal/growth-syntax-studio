import { Utils } from './utils';

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

const evaluteCurrentCashFlow = (fundamentals: Fundamental[]): number => {
  const list = fundamentals;
  const currentData = Utils.getLastObject(list);
  const prevData = Utils.getSecondLastObject(list);
  const currentWorkingCapital = currentData.ASSETSC - currentData.LIABILITIESC;
  const previousWorkingCapital = prevData.ASSETSC - prevData.LIABILITIESC;
  const currentValue = currentWorkingCapital
    - previousWorkingCapital
    + Math.abs(currentData.CAPEX)
    + currentData.NETINC;
  return currentValue;
};

const forcastedCashFromRevenue = (fundamentals: Fundamental[], timeFrame: number, estimatedGrowthRate?: number): number[] => {
  const list = fundamentals;
  const revenueOverTime = Utils.reduce(list, 'REVENUE', (val: number) => val) as number[];
  const fcfOverTime = Utils.reduce(list, 'FCF', (val: number) => val) as number[];
  const ratios = Utils.combinedOperation(fcfOverTime, revenueOverTime, (a: number, b: number) => Utils.divide(a, b));
  const averageRatio = Utils.average(ratios);

  const revenueGrowthRates = Finance.growthRates(revenueOverTime);
  const revenueGrowth = Utils.average(revenueGrowthRates);
  const growthRate = (estimatedGrowthRate !== undefined) ? estimatedGrowthRate : revenueGrowth;

  const lastRevenue = revenueOverTime.length > 0 ? revenueOverTime[revenueOverTime.length - 1] : 0;
  const forcastedRevenue = Forcast(growthRate, lastRevenue, timeFrame);
  const forcastedFCF = forcastedRevenue.map(x => x * averageRatio);
  console.log('forcastedCashFromRevenue', {
    revenueGrowthRates,
    revenueGrowth,
    growthRate,
    ratios,
    averageRatio,
    forcastedRevenue,
    forcastedFCF
  });
  return forcastedFCF;
};

const forcastedCashFromDividend = (fundamentals: Fundamental[], timeFrame: number, estimatedGrowthRate?: number): number[] => {
  const list = fundamentals;
  const dividendPerShareOverTime = Utils.reduce(list, 'DPS', (val: number) => val) as number[];
  const sharesOverTime = Utils.reduce(list, 'SHARESWA', (val: number) => val) as number[];
  const dividendOverTime = Utils.combinedOperation(dividendPerShareOverTime, sharesOverTime, (a: number, b: number) => a * b);

  const fcfOverTime = Utils.reduce(list, 'FCF', (val: number) => val) as number[];
  const ratios = Utils.combinedOperation(fcfOverTime, dividendOverTime, (a: number, b: number) => Utils.divide(a, b));
  const averageRatio = Utils.average(ratios);

  const dividendGrowthRates = Finance.growthRates(dividendOverTime);
  const dividendGrowth = Utils.average(dividendGrowthRates);
  const growthRate = (estimatedGrowthRate !== undefined) ? estimatedGrowthRate : dividendGrowth;

  const lastDividend = dividendOverTime.length > 0 ? dividendOverTime[dividendOverTime.length - 1] : 0;
  const forcastedDividend = Forcast(growthRate, lastDividend, timeFrame);
  const forcastedFCF = forcastedDividend.map(x => x * averageRatio);
  console.log('forcastedCashFromDividend', {
    estimatedGrowthRate,
    dividendGrowthRates,
    dividendGrowth,
    growthRate,
    ratios,
    averageRatio,
    forcastedDividend,
    forcastedFCF
  });
  return forcastedFCF;
};

const evaluateFutureCashFlow = (
  profile: Profile,
  fundamentals: Fundamental[],
  estimatedGrowthRate: number | undefined,
  timeFrame: number
): number[] => {
  const list = fundamentals;
  const sector = profile.sector;
  const currentValue = evaluteCurrentCashFlow(fundamentals);
  const futureCashFlow = (sector !== 'Financial')
    ? forcastedCashFromRevenue(fundamentals, timeFrame, estimatedGrowthRate)
    : forcastedCashFromDividend(fundamentals, timeFrame, estimatedGrowthRate);
  futureCashFlow[0] = Number.isNaN(currentValue) ? futureCashFlow[0] : currentValue;
  return futureCashFlow;
};

const getPresentValue = (discountRate: number, futureCashFlow: number[], timeFrame: number): { total: number, values: number[] } => {
  let values: number[] = [];
  for (let year = 1; year <= timeFrame; year++) {
    const futureValue = futureCashFlow[year];
    const presentValue = PV(discountRate, futureValue, year);
    values.push(presentValue);
  }
  const total = values.reduce((sum, value) => sum + value, 1);
  return {
    total,
    values
  };
};

const getFairValue = (fundamentals: Fundamental[], presentValues: { total: number }, presentTerminalValue: number): number => {
  const list = fundamentals;
  const currentData = Utils.getLastObject(list);
  const sharesOutstanding = currentData.SHARESWA;
  const obligations = currentData.LIABILITIESNC || 0;
  const cash = Math.abs(currentData.NCFF)
    + Math.abs(currentData.NCFI)
    + Math.abs(currentData.NCFO);

  const equityValue = presentValues.total
    + presentTerminalValue
    - obligations;
  const fairValue = Utils.round(equityValue / sharesOutstanding, 2);
  console.log('getFairValue', {
    fairValue,
    cash,
    obligations,
    equityValue
  });
  return fairValue;
};

const evaluateDCF = (
  profile: Profile,
  fundamentals: Fundamental[],
  timeFrame: number,
  discountRate: number,
  riskFreeRate: number,
  estimatedGrowthRate?: number
): number => {
  const futureCashFlow = evaluateFutureCashFlow(profile, fundamentals, estimatedGrowthRate, timeFrame);
  const presentValues = getPresentValue(discountRate, futureCashFlow, timeFrame);
  const terminalValue = TV(riskFreeRate, discountRate, futureCashFlow[timeFrame]);
  const presentTerminalValue = PV(discountRate, terminalValue, timeFrame);
  const fairValue = getFairValue(fundamentals, presentValues, presentTerminalValue);
  console.log('DCF', {
    discountRate,
    presentValues,
    futureCashFlow,
    terminalValue,
    presentTerminalValue,
    fairValue
  });
  return fairValue;
};

const getCashAllocationData = (data: {
    NCFI?: number;
    CAPEX?: number;
    RND?: number;
}): { capex: number; rnd: number; acquisitions: number } => {
    const { NCFI = 0, CAPEX = 0, RND = 0 } = data;
    const NetCashFlowFromInvesting = Math.abs(NCFI);
    const capex = Math.abs(CAPEX);
    const rnd = Math.abs(RND);
    const acquisitions = Math.abs(capex - NetCashFlowFromInvesting);
    const totalAllocation = capex + rnd + acquisitions;

    const fix = (value: number): number => (value < 0) ? 0 :
        (value < 1) ? Number((value * 100).toFixed(2)) : 100; // TO DO: remove after cleaner data
    const capexPercentage = fix(Utils.divide(capex, totalAllocation));
    const rndPercentage = fix(Utils.divide(rnd, totalAllocation));
    const acquisitionsPercentage = fix(Utils.divide(acquisitions, totalAllocation));
    return {
        capex: capexPercentage, //production
        rnd: rndPercentage, //research
        acquisitions: acquisitionsPercentage //acquisitions
    };
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
  Forcast,
  getCashAllocationData
};

export default Finance;
