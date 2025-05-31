
import { config } from 'dotenv';
config(); // Load environment variables from .env

import { readCsvFile, parseCsvData, type CompanyCsvRecord } from './csvUtils';
import { addCompany, getCompanyByTicker, type Company } from '../lib/db/companies';
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

const isValidCompany = (company: Company): boolean => {
  if (!company.ticker || !company.name) {
    return false; // Ensure ticker and name are present
  }
  if (!tickerList.includes(company.ticker)) {
    return false
  }
  if(company.industry?.includes('Shell Companies')) {
    return false; // Skip shell companies
  }
  return true;
}

async function importCompanies() {
  if (!CSV_FILE_PATH) {
    console.error('CSV file path is not set. Please configure the CSV_FILE_PATH variable.');
    process.exit(1);
  }

  try {
    console.log(`Reading CSV file from: ${CSV_FILE_PATH}`);
    const csvData = await readCsvFile(CSV_FILE_PATH);
    const records: CompanyCsvRecord[] = await parseCsvData(csvData);

    console.log(`Found ${records.length} records in the CSV file.`);
    let companiesAdded = 0;
    let companiesSkipped = 0;
    let errorsEncountered = 0;

    for (const record of records) {
      try {
        // --- IMPORTANT: ADJUST COLUMN MAPPING HERE ---
        // Map CSV columns to the Company interface fields.
        // The keys on the 'record' object will match your CSV header names.
        // Example: if your CSV has 'Company Name', use record['Company Name']
        const companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'> = {
          ticker: record.ticker || record.Ticker || '', // Ensure ticker is not undefined
          name: record.name || record.Name || '',       // Ensure name is not undefined
          sector: record.sector || record.Sector,
          industry: record.industry || record.Industry,
          marketCap: toNumber(record.marketCap || record.MarketCap),
          mostBought: toBoolean(record.mostBought || record.MostBought),
          mostSold: toBoolean(record.mostSold || record.MostSold),
          mostTraded: toBoolean(record.mostTraded || record.MostTraded),
          closingPrice: toNumber(record.closingPrice || record.ClosingPrice),
          openingPrice: toNumber(record.openingPrice || record.OpeningPrice),
          volume: toNumber(record.volume || record.Volume),
          // lastRefreshed can be set if your CSV has it, or handle it separately
        };
        // -------------------------------------------

        if (!isValidCompany(companyData)) {
          console.warn('Skipping record due to missing ticker or name:', record);
          companiesSkipped++;
          continue;
        }

        const existingCompany = false;//await getCompanyByTicker(companyData.ticker);
        if (existingCompany) {
          console.log(`Company with ticker ${companyData.ticker} already exists. Skipping.`);
          // Optionally, you could update the existing company here:
          // await updateCompany(existingCompany.id!, companyData); // Assuming id is always present
          // console.log(`Company with ticker ${companyData.ticker} updated.`);
          companiesSkipped++;
          continue;
        }
        console.log(`[MOCK]Adding new company: ${companyData.name} (${companyData.ticker})`, companyData);
        // await addCompany(companyData);
        companiesAdded++;
        console.log(`Successfully added company: ${companyData.name} (${companyData.ticker})`);
      } catch (error) {
        errorsEncountered++;
        console.error(`Error processing record: ${JSON.stringify(record)}`, error);
      }
    }

    console.log('\n--- Import Summary ---');
    console.log(`Successfully added ${companiesAdded} new companies.`);
    console.log(`Skipped ${companiesSkipped} companies (e.g., missing data or duplicates).`);
    console.log(`Encountered ${errorsEncountered} errors during processing.`);
    console.log('---------------------\n');
    
    process.exit(0);

  } catch (error) {
    console.error('Failed to import companies:', error);
    process.exit(1);
  }
}

importCompanies();
