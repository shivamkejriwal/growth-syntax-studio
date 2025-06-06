import { config } from 'dotenv';
config(); // Load environment variables from .env

import { importEquityPrices, type EquityPriceData } from './importEquityPricesFromCsv';
import { importCompanies } from './importCompaniesFromCsv';
import type { Company } from '../../lib/db/companies';
import { COMPANY_CSV_FILE_PATH, EQUITY_PRICE_CSV_FILE_PATH, TARGET_DATE } from './constants';
import { toNumber } from './parseUtils';

// Removed local toNumber helper, now using shared utility

async function updateCompanyPrices(companyCsvPath?: string, equityPriceCsvPath?: string, targetDate?: string) {
  const resolvedCompanyCsvPath = companyCsvPath || COMPANY_CSV_FILE_PATH;
  const resolvedEquityPriceCsvPath = equityPriceCsvPath || EQUITY_PRICE_CSV_FILE_PATH;
  const resolvedTargetDate = targetDate || TARGET_DATE;
  if (!resolvedCompanyCsvPath || !resolvedEquityPriceCsvPath || !resolvedTargetDate) {
    console.error('CSV file paths or target date are not set. Please provide them or configure the constants.');
    process.exit(1);
  }

  console.log(`Reading Equity Price CSV file from: ${resolvedEquityPriceCsvPath} for date ${resolvedTargetDate}`);
  const equityPriceDataForDate = await importEquityPrices(resolvedEquityPriceCsvPath, resolvedTargetDate);
  console.log(`Found ${equityPriceDataForDate.length} equity price records for ${resolvedTargetDate}.`);

  let companiesUpdated = 0;
  let companiesSkipped = 0;
  let errorsEncountered = 0;

  try {
    const companies: Company[] = await importCompanies(resolvedCompanyCsvPath);

    for (const companyRecord of companies) {
      const ticker = companyRecord.ticker;
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
           name: companyRecord.name,
           sector: companyRecord.sector,
           industry: companyRecord.industry,
           marketCap: toNumber(companyRecord.marketCap as string | null | undefined),
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