import { config } from 'dotenv';
config(); // Load environment variables from .env

import { readCsvFile, parseCsvData, type CompanyCsvRecord } from './csvUtils';
import { importEquityPrices, type EquityPriceData } from './importEquityPricesFromCsv'; // Assuming you have this function
import { importCompanies, type Company } from './importCompaniesFromCsv'; // Import the importCompanies function

// --- IMPORTANT: CONFIGURE THESE ---
// Set the absolute path to your Company CSV file
const COMPANY_CSV_FILE_PATH = '/Users/shivam/Downloads/GrowthSyntax/SHARADAR_TICKERS_sample1.csv';
// Set the absolute path to your Equity Price CSV file
const EQUITY_PRICE_CSV_FILE_PATH = '/Users/shivam/Downloads/GrowthSyntax/sample/SHARADAR-SEP.csv';
// Set the target date for which to fetch equity prices (YYYY-MM-DD)
const TARGET_DATE = '2018-12-31';
// ---------------------------------

// Helper function to convert string values to number, returns undefined if not a valid number
const toNumber = (value: string | undefined | null): number | undefined => {
  if (value === null || value === undefined || value.trim() === '') {
    return undefined;
  }
  const num = parseFloat(value);
  return isNaN(num) ? undefined : num;
};

async function updateCompanyPrices(companyCsvPath?: string, equityPriceCsvPath?: string, targetDate?: string) {
  const resolvedCompanyCsvPath = companyCsvPath || COMPANY_CSV_FILE_PATH;
  const resolvedEquityPriceCsvPath = equityPriceCsvPath || EQUITY_PRICE_CSV_FILE_PATH;
  const resolvedTargetDate = targetDate || TARGET_DATE;
  if (!resolvedCompanyCsvPath || !resolvedEquityPriceCsvPath || !resolvedTargetDate) {
    console.error('CSV file paths or target date are not set. Please provide them or configure the constants.');
    process.exit(1);
  }

    console.log(`Reading Equity Price CSV file from: ${EQUITY_PRICE_CSV_FILE_PATH} for date ${TARGET_DATE}`);
    const equityPriceDataForDate = await importEquityPrices(EQUITY_PRICE_CSV_FILE_PATH, TARGET_DATE);
    console.log(`Found ${equityPriceDataForDate.length} equity price records for ${TARGET_DATE}.`);

    let companiesUpdated = 0;
    let companiesSkipped = 0;
    let errorsEncountered = 0;

  try {
    const companies = await importCompanies(resolvedCompanyCsvPath);

    for (const companyRecord of companies) {
      const ticker = companyRecord.ticker || companyRecord.Ticker;
      if (!ticker) {
        console.warn('Skipping company record due to missing ticker:', companyRecord);
        companiesSkipped++;
        continue;
      }

      try {
        // Find the equity price data for the current company and target date
        const equityPrice = equityPriceDataForDate.find(price => price.ticker === ticker);

        // Simulate fetching existing company (replace with actual DB call if needed)
        // const existingCompany = await getCompanyByTicker(ticker);
        // if (!existingCompany) {
        //   console.warn(`Company with ticker ${ticker} not found in DB. Skipping price update.`);
        //   companiesSkipped++;
        //   continue;
        // }

        // Create a mock company object based on the CSV record for demonstration
        // In a real scenario, you would update the existingCompany object fetched from the DB
        const updatedCompanyData: Partial<Company> = {
           ticker: ticker,
           name: companyRecord.name || companyRecord.Name,
           sector: companyRecord.sector || companyRecord.Sector,
           industry: companyRecord.industry || companyRecord.Industry,
           marketCap: toNumber(companyRecord.marketCap || companyRecord.MarketCap),
           // Keep other company fields as they are or map from companyRecord
           // ... (map other fields from companyRecord as needed)
        };


        if (equityPrice) {
          updatedCompanyData.closingPrice = equityPrice.close;
          console.log(`[MOCK] Updating price for ${ticker} to ${equityPrice.close} for date ${TARGET_DATE}`);
          // In a real application, you would update the company in your database here:
          // await updateCompany(existingCompany.id, { closingPrice: equityPrice.close });
        } else {
          updatedCompanyData.closingPrice = undefined; // Explicitly set to undefined if no price found
          console.log(`No equity price found for ${ticker} on ${TARGET_DATE}. Setting closingPrice to undefined.`);
        }

        // Simulate adding/updating the company object for logging
         console.log(`[MOCK] Processed company: ${updatedCompanyData.name} (${updatedCompanyData.ticker}) with closing price: ${updatedCompanyData.closingPrice}`);

        companiesUpdated++;

      } catch (error) {
        errorsEncountered++;
        console.error(`Error processing price update for company with ticker ${ticker}:`, error);
      }
    }

    console.log('\n--- Price Update Summary ---');
    console.log(`Successfully processed price updates for ${companiesUpdated} companies.`);
    console.log(`Skipped ${companiesSkipped} company records.`);
    console.log(`Encountered ${errorsEncountered} errors during processing.`);
    console.log('---------------------\n');

    process.exit(0);

  } catch (error) {
    console.error('Failed to update company prices:', error);
    process.exit(1);
  }
}

updateCompanyPrices();