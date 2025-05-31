// src/services/csvUtils.ts
import { promises as fs } from 'fs';
import { parse, Parser } from 'csv-parse';

/**
 * CsvRecord serves as a generic base interface for CSV records.
 * It allows for arbitrary string-keyed properties, with values that are either strings or undefined.
 */
export interface CsvRecord {
  [key: string]: string | undefined;
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
 * This function is generic and can parse CSV data into any shape that extends CsvRecord.
 * @param csvData - The string content of the CSV file.
 * @returns A Promise that resolves with an array of objects parsed from the CSV data.
 */
export function parseCsvData<T extends CsvRecord = CsvRecord>(csvData: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const parser: Parser = parse(csvData, {
      columns: true, // Treat the first row as headers, creating objects
      skip_empty_lines: true,
      trim: true,
    });

    const records: T[] = [];
    parser.on('readable', () => {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record as T);
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
