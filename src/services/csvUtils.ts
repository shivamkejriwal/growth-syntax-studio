// src/services/csvUtils.ts
import { promises as fs } from 'fs';
import { parse, Parser } from 'csv-parse';

/**
 * Represents the structure of a single row of company data from the CSV.
 * Adjust this interface to match the actual columns in your CSV file.
 */
export interface CompanyCsvRecord {
  [key: string]: string | undefined; // Allows for arbitrary columns, but define known ones for type safety
  ticker?: string;
  name?: string;
  sector?: string;
  industry?: string;
  marketCap?: string; // CSVs usually read numbers as strings initially
  mostBought?: string;
  mostSold?: string;
  mostTraded?: string;
  closingPrice?: string;
  openingPrice?: string;
  volume?: string;
}

/**
 * Reads a CSV file from the given file path.
 * @param filePath - The absolute path to the CSV file.
 * @returns A Promise that resolves with the string content of the file.
 */
export async function readCsvFile(filePath: string): Promise<string> {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return data;
  } catch (error) {
    console.error(`Error reading CSV file at ${filePath}:`, error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

/**
 * Parses CSV data string into an array of objects.
 * @param csvData - The string content of the CSV file.
 * @returns A Promise that resolves with an array of CompanyCsvRecord objects.
 */
export function parseCsvData(csvData: string): Promise<CompanyCsvRecord[]> {
  return new Promise((resolve, reject) => {
    const parser: Parser = parse(csvData, {
      columns: true, // Treat the first row as headers, creating objects
      skip_empty_lines: true,
      trim: true,
    });

    const records: CompanyCsvRecord[] = [];
    parser.on('readable', () => {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record as CompanyCsvRecord);
      }
    });

    parser.on('error', (err) => {
      console.error('Error parsing CSV data:', err);
      reject(err);
    });

    parser.on('end', () => {
      resolve(records);
    });
  });
}
