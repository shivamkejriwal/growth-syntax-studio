import { config } from 'dotenv';
config(); // Load environment variables from .env

import { parseCsvData, type CsvRecord, createCsvTransform, processCsvWithTransform } from './csvUtils';
import { addCompany, getCompanyByTicker } from '../../lib/db/companies';
import type { Company } from '../../lib/db/companies';
import tickerList from '../tickerList.json';
import { COMPANY_CSV_FILE_PATH } from './constants';
import { toBoolean, toNumber } from './parseUtils';

interface CompanyCsvRecord extends CsvRecord {
  ticker?: string;
  name?: string;
  sector?: string;
  industry?: string;
  marketCap?: string;
  mostBought?: string;
  mostSold?: string;
  mostTraded?: string;
  closingPrice?: string;
  openingPrice?: string;
  volume?: string;
  Ticker?: string;
  Name?: string;
  Sector?: string;
  Industry?: string;
  MarketCap?: string;
  MostBought?: string;
  MostSold?: string;
  MostTraded?: string;
  ClosingPrice?: string;
  OpeningPrice?: string;
  Volume?: string;
}

const isValidCompanyRecord = (companyData: Company): boolean => {
  if (!companyData.ticker || !companyData.name) {
    console.warn(`Skipping record due to missing ticker or name`);
    return false;
  }

  if (!tickerList.includes(companyData.ticker)) {
    console.warn(`Skipping company ${companyData.name} (${companyData.ticker}) as its ticker is not in the approved list.`);
    return false;
  }

  if (companyData.industry?.toLowerCase().includes('shell companies')) {
    console.warn(`Skipping shell company: ${companyData.name} (${companyData.ticker})`);
    return false;
  }
  return true
}

export async function importCompanies(filePath?: string): Promise<Company[]> {
  const csvPathToUse = filePath || COMPANY_CSV_FILE_PATH;
  if (!csvPathToUse) {
    console.error('CSV file path is not set. Please configure the CSV_FILE_PATH variable or provide a filePath argument.');
    throw new Error('CSV_FILE_PATH is not configured.');
  }

  let companiesAdded = 0;
  let companiesSkipped = 0;
  let errorsEncountered = 0;

  const dataTransformer = createCsvTransform<CompanyCsvRecord, Company>((chunk, push, callback) => {
    const companyData: Company = {
      ticker: chunk.ticker || chunk.Ticker || '',
      name: chunk.name || chunk.Name || '',
      sector: chunk.sector || chunk.Sector,
      industry: chunk.industry || chunk.Industry,
      marketCap: toNumber(chunk.marketCap || chunk.MarketCap),
      mostBought: toBoolean(chunk.mostBought || chunk.MostBought),
      mostSold: toBoolean(chunk.mostSold || chunk.MostSold),
      mostTraded: toBoolean(chunk.mostTraded || chunk.MostTraded),
      closingPrice: toNumber(chunk.closingPrice || chunk.ClosingPrice),
      openingPrice: toNumber(chunk.openingPrice || chunk.OpeningPrice),
      volume: toNumber(chunk.volume || chunk.Volume),
    };

    if (!isValidCompanyRecord(companyData)) {
      companiesSkipped++;
      callback();
      return;
    }

    // const existingCompany = await getCompanyByTicker(companyData.ticker);
    const existingCompany = null; // Mocking as if company doesn't exist to proceed to "add" logic
    console.log(`[MOCK] Checking if company with ticker ${companyData.ticker} exists (DB call skipped).`);

    if (existingCompany) {
      console.log(`[MOCK] Company with ticker ${companyData.ticker} already exists. Skipping.`);
      companiesSkipped++;
      callback();
      return;
    }

    console.log(`[MOCK] Adding new company: ${companyData.name} (${companyData.ticker}) (DB call skipped).`);
    // await addCompany(companyData);
    companiesAdded++;
    push(companyData);
    console.log(`Successfully processed (mocked add) company: ${companyData.name} (${companyData.ticker})`);
    callback();
  });

  const importedCompanies = await processCsvWithTransform<CompanyCsvRecord, Company>(
    csvPathToUse,
    parseCsvData,
    dataTransformer
  );

  console.log('\n--- Import Summary ---');
  console.log(`Successfully processed (mocked add) ${companiesAdded} new companies.`);
  console.log(`Skipped ${companiesSkipped} companies (e.g., missing data, duplicates, not in ticker list, or shell company).`);
  console.log(`Encountered ${errorsEncountered} errors during processing.`);
  console.log('---------------------\n');

  return importedCompanies;
}

// This block ensures the importCompanies function is called only when the script is run directly
if (require.main === module) {
  importCompanies()
    .then(() => {
      console.log('Company import script finished (DB interactions were mocked).');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Company import script failed:', error);
      process.exit(1);
    });
}
