
import { config } from 'dotenv';
config(); // Load environment variables from .env

import { readCsvFile, parseCsvData, type CompanyCsvRecord } from './csvUtils';
import { addCompany, getCompanyByTicker } from '../lib/db/companies';
import type { Company } from '../lib/db/companies'; // Ensure Company type is imported
import tickerList from './tickerList.json';

// --- IMPORTANT: CONFIGURE THIS ---
// Set the absolute path to your CSV file
const CSV_FILE_PATH = '/Users/shivam/Downloads/GrowthSyntax/SHARADAR_TICKERS_sample1.csv';
// Example: '/Users/yourname/Downloads/my_companies.csv'
// ---------------------------------

// Helper function to convert string values to boolean
const toBoolean = (value: string | undefined | null): boolean | undefined => {
  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase();
    if (lowerValue === 'true' || lowerValue === '1') return true;
    if (lowerValue === 'false' || lowerValue === '0') return false;
  }
  return undefined; // Or false by default if preferred
};

// Helper function to convert string values to number, returns undefined if not a valid number
const toNumber = (value: string | undefined | null): number | undefined => {
  if (value === null || value === undefined || value.trim() === '') {
    return undefined;
  }
  const num = parseFloat(value);
  return isNaN(num) ? undefined : num;
};

export async function importCompanies(filePath?: string) {
  const csvPathToUse = filePath || CSV_FILE_PATH;
  if (!csvPathToUse) {
    console.error('CSV file path is not set. Please configure the CSV_FILE_PATH variable or provide a filePath argument.');
    // Throw an error instead of exiting, so the calling context can handle it.
    throw new Error('CSV_FILE_PATH is not configured.');
  }

  let companiesAdded = 0;
  let companiesSkipped = 0;
  let errorsEncountered = 0;

  console.log(`Reading CSV file from: ${csvPathToUse}`);
  const csvData = await readCsvFile(csvPathToUse);
  const records: CompanyCsvRecord[] = await parseCsvData(csvData);

  console.log(`Found ${records.length} records in the CSV file.`);

  for (const record of records) {
    try {
      const companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'> = {
        ticker: record.ticker || record.Ticker || '',
        name: record.name || record.Name || '',
        sector: record.sector || record.Sector,
        industry: record.industry || record.Industry,
        marketCap: toNumber(record.marketCap || record.MarketCap),
        mostBought: toBoolean(record.mostBought || record.MostBought),
        mostSold: toBoolean(record.mostSold || record.MostSold),
        mostTraded: toBoolean(record.mostTraded || record.MostTraded),
        closingPrice: toNumber(record.closingPrice || record.ClosingPrice),
        openingPrice: toNumber(record.openingPrice || record.OpeningPrice),
        volume: toNumber(record.volume || record.Volume),
      };

      if (!companyData.ticker || !companyData.name) {
        console.warn(`Skipping record due to missing ticker or name. Record: ${JSON.stringify(record)}`);
        companiesSkipped++;
        continue;
      }

      if (companyData.industry?.toLowerCase().includes('shell companies')) {
        console.warn(`Skipping shell company: ${companyData.name} (${companyData.ticker}). Record: ${JSON.stringify(record)}`);
        companiesSkipped++;
        continue;
      }

      if (!tickerList.includes(companyData.ticker)) {
        console.warn(`Skipping company ${companyData.name} (${companyData.ticker}) as its ticker is not in the approved list. Record: ${JSON.stringify(record)}`);
        companiesSkipped++;
        continue;
      }

      // const existingCompany = await getCompanyByTicker(companyData.ticker);
      const existingCompany = null; // Mocking as if company doesn't exist to proceed to "add" logic
      console.log(`[MOCK] Checking if company with ticker ${companyData.ticker} exists (DB call skipped).`);


      if (existingCompany) {
        console.log(`[MOCK] Company with ticker ${companyData.ticker} already exists. Skipping.`);
        companiesSkipped++;
        continue;
      }

      console.log(`[MOCK] Adding new company: ${companyData.name} (${companyData.ticker}) (DB call skipped).`);
      // await addCompany(companyData);
      companiesAdded++;
      console.log(`Successfully processed (mocked add) company: ${companyData.name} (${companyData.ticker})`);

    } catch (error) {
      errorsEncountered++;
      console.error(`Error processing record: ${JSON.stringify(record)}`, error);
    }
  }

  console.log('\n--- Import Summary ---');
  console.log(`Successfully processed (mocked add) ${companiesAdded} new companies.`);
  console.log(`Skipped ${companiesSkipped} companies (e.g., missing data, duplicates, not in ticker list, or shell company).`);
  console.log(`Encountered ${errorsEncountered} errors during processing.`);
  console.log('---------------------\n');
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
