import { readCsvFile, parseCsvData } from './csvReader.js'; // Assuming this file is in the same directory

const csvFilePath = '/Users/shivam/Downloads/GrowthSyntax/SHARADAR_TICKERS_sample1.csv';

async function processCsv() {
  try {
    const csvData = await readCsvFile(csvFilePath);
    const parsedData = await parseCsvData(csvData);
    console.log('Parsed CSV Data:');
    console.log(parsedData);
  } catch (error) {
    console.error('Error processing CSV:', error);
  }
}

processCsv();