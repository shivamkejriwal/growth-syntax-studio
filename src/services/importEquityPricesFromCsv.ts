import fs from 'fs';
import csv from 'csv-parser';
import { Transform, TransformCallback } from 'stream';

interface EquityPriceCsvRecord {
  ticker?: string;
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeadj: string;
  closeunadj: string;
  lastupdated: string;
}

export interface EquityPriceData {
  ticker: string; // Ensure ticker is always present in the final data
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeadj: number;
  closeunadj: number;
  lastupdated: string;
}

// --- IMPORTANT: CONFIGURE THIS ---
// Set the absolute path to your CSV file
const CSV_FILE_PATH = '/Users/shivam/Downloads/GrowthSyntax/sample/SHARADAR-SEP.csv';
// ---------------------------------

export async function importEquityPrices(filePath: string, targetDate: string): Promise<EquityPriceData[]> {
  const results: EquityPriceData[] = [];

  return new Promise((resolve, reject) => {
    const dataTransformer = new Transform({
      objectMode: true,
      transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) { // Use 'any' for initial parsing flexibility
        if (
          chunk.ticker &&
          chunk.date &&
          chunk.close &&
          chunk.volume &&
          chunk.date === targetDate
        ) {
          try {
            const equityPrice: EquityPriceData = {
              ticker: chunk.ticker,
              date: chunk.date,
              open: parseFloat(chunk.open),
              high: parseFloat(chunk.high),
              low: parseFloat(chunk.low),
              close: parseFloat(chunk.close),
              volume: parseInt(chunk.volume, 10) || 0, // Default volume to 0 if parsing fails
              closeadj: parseFloat(chunk.closeadj) || parseFloat(chunk.close), // Default closeadj if parsing fails
              closeunadj: parseFloat(chunk.closeunadj) || parseFloat(chunk.close), // Default closeunadj if parsing fails
              lastupdated: chunk.lastupdated,
            };
            this.push(equityPrice);
          } catch (error) {
            console.error(`Error parsing data for ticker ${chunk.ticker} on date ${chunk.date}:`, error);
          }
        }
        callback();
      },
    });

    fs.createReadStream(filePath)
      .pipe(csv())
      .pipe(dataTransformer)
      .on('data', (data: EquityPriceData) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error: Error) => {
        reject(error);
      });
  });
}

// Example usage (you would typically call this from another file):
// const csvFilePath = CSV_FILE_PATH; // Use the configured path
// const dateToImport = '2018-12-31'; // Replace with the desired date
// importEquityPricesFromCsv(csvFilePath, dateToImport)
//   .then((equityPrices) => {
//     console.log(`Imported ${equityPrices.length} equity price records for ${dateToImport}`);
//     console.log(equityPrices);
//   })
//   .catch((error) => {
//     console.error('Error importing equity prices:', error);
//   });