import { promises as fs } from 'fs';
import { parse } from 'csv-parse';

interface CompanyData {
  table: string;
  permaticker: string;
  ticker: string;
  name: string;
  exchange: string;
  isdelisted: string; // Or boolean if you parse it
  category: string;
  cusips: string;
  siccode: string; // Or number
  sicsector: string;
  sicindustry: string;
  famasector: string;
  famaindustry: string;
  sector: string;
  industry: string;
  scalemarketcap: string; // Or number
  scalerevenue: string; // Or number
  relatedtickers: string;
  currency: string;
  location: string;
  lastupdated: string; // Or Date
  firstadded: string; // Or Date
  firstpricedate: string; // Or Date
  lastpricedate: string; // Or Date
  firstquarter: string;
  lastquarter: string;
  secfilings: string;
  companysite: string;
}

export const readCsvFile = async (filePath: string): Promise<string> => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return data;
  } catch (error) {
    console.error(`Error reading CSV file at ${filePath}:`, error);
    throw error;
  }
};

export const parseCsvData = (csvData: string): Promise<CompanyData[]> => {
  return new Promise((resolve, reject) => {
    parse(csvData, {
      columns: true, // Treat the first row as headers
      skip_empty_lines: true,
    }, (err, records: CompanyData[]) => {
      if (err) {
        console.error('Error parsing CSV data:', err);
        return reject(err);
      }
      resolve(records);
    });
  });
};

// Example usage (optional, remove if not needed)
// async function processCsv(filePath: string) {
//   try {
//     const csvString = await readCsvFile(filePath);
//     const companyData = await parseCsvData(csvString);
//     console.log(companyData);
//   } catch (error) {
//     console.error('Failed to process CSV:', error);
//   }
// }

// processCsv('path/to/your/file.csv');