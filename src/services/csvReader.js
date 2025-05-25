import { promises as fs } from 'fs';
import { parse } from 'csv-parse';

// The CompanyData interface is removed in JavaScript.
// You'd typically rely on the structure of the objects returned by the parser.
// The objects in the 'records' array will have properties corresponding
// to the CSV headers.

export const readCsvFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return data;
  } catch (error) {
    console.error(`Error reading CSV file at ${filePath}:`, error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const parseCsvData = (csvData) => {
  return new Promise((resolve, reject) => {
    parse(csvData, {
      columns: true, // Treat the first row as headers
      skip_empty_lines: true,
    }, (err, records) => { // Type annotation for records is removed
      if (err) {
        console.error('Error parsing CSV data:', err);
        return reject(err);
      }
      resolve(records);
    });
  });
};

// Example usage (optional, remove if not needed)
// async function processCsv(filePath) {
//   try {
//     const csvString = await readCsvFile(filePath);
//     const companyDataArray = await parseCsvData(csvString);
//     console.log(companyDataArray);
//     // Each element in companyDataArray will be an object, e.g.:
//     // {
//     //   table: '...',
//     //   permaticker: '...',
//     //   ticker: '...',
//     //   // ... and so on for all columns in your CSV
//     // }
//   } catch (error) {
//     console.error('Failed to process CSV:', error);
//   }
// }

// processCsv('path/to/your/file.csv');
