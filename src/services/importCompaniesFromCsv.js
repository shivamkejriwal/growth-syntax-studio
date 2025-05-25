
import { config } from 'dotenv';
config(); // Load environment variables from .env

import { readCsvFile, parseCsvData } from './csvUtils.js'; // Using .js extension for Node ESM compatibility, tsx handles .ts
import { addCompany, getCompanyByTicker } from '../lib/db/companies.js';

// --- IMPORTANT: CONFIGURE THIS ---
// Set the absolute path to your CSV file
const CSV_FILE_PATH = '/path/to/your/local/companies.csv'; 
// Example: '/Users/yourname/Downloads/my_companies.csv'
// ---------------------------------

// Helper function to convert string values to boolean
const toBoolean = (value) => {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return Boolean(value);
};

// Helper function to convert string values to number, returns undefined if not a valid number
const toNumber = (value) => {
  if (value === null || value === undefined || value.trim() === '') {
    return undefined;
  }
  const num = parseFloat(value);
  return isNaN(num) ? undefined : num;
};

async function importCompanies() {
  if (CSV_FILE_PATH === '/path/to/your/local/companies.csv') {
    console.error(
      '\nERROR: Please update the CSV_FILE_PATH in src/services/importCompaniesFromCsv.js before running this script.\n'
    );
    return;
  }

  try {
    console.log(`Reading CSV file from: ${CSV_FILE_PATH}`);
    const csvData = await readCsvFile(CSV_FILE_PATH);
    const records = await parseCsvData(csvData);

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
        const companyData = {
          ticker: record.ticker || record.Ticker, // Adjust as per your CSV
          name: record.name || record.Name,       // Adjust as per your CSV
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

        if (!companyData.ticker || !companyData.name) {
          console.warn('Skipping record due to missing ticker or name:', record);
          companiesSkipped++;
          continue;
        }

        // Optional: Check if company already exists by ticker to avoid duplicates
        const existingCompany = await getCompanyByTicker(companyData.ticker);
        if (existingCompany) {
          console.log(`Company with ticker ${companyData.ticker} already exists. Skipping.`);
          // Optionally, you could update the existing company here:
          // await updateCompany(existingCompany.id, companyData);
          // console.log(`Company with ticker ${companyData.ticker} updated.`);
          companiesSkipped++;
          continue;
        }

        await addCompany(companyData);
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
    
    // For very large CSVs, Firestore operations might take time.
    // Consider adding more sophisticated progress indication or batching.

  } catch (error) {
    console.error('Failed to import companies:', error);
  } finally {
    // Ensure the script exits, especially if there are open Firebase connections.
    // Depending on how Firebase SDK handles connections in standalone scripts,
    // you might need process.exit() or specific Firebase app termination.
    // For now, let it exit naturally. If it hangs, consider process.exit(0) on success
    // and process.exit(1) on failure.
  }
}

importCompanies();
