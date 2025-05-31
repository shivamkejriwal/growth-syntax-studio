import { Transform, TransformCallback } from 'stream';
import { readCsvFile, parseCsvData, type CsvRecord } from './csvUtils';
import { EQUITY_PRICE_CSV_FILE_PATH, TARGET_DATE } from './constants';

interface EquityPriceCsvRecord extends CsvRecord {
  ticker?: string;
  date?: string; // Date might be missing in a bad row
  open?: string;
  high?: string;
  low?: string;
  close?: string;
  volume?: string;
  closeadj?: string;
  closeunadj?: string;
  lastupdated?: string;
}

export interface EquityPriceData {
  ticker: string;
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

export async function importEquityPrices(filePath?: string, targetDate?: string): Promise<EquityPriceData[]> {
  const results: EquityPriceData[] = [];
  const pathToRead = filePath || EQUITY_PRICE_CSV_FILE_PATH;
  const dateToUse = targetDate || TARGET_DATE;

  return new Promise((resolve, reject) => {
    const dataTransformer = new Transform({
      objectMode: true,
      transform(chunk: EquityPriceCsvRecord, encoding: BufferEncoding, callback: TransformCallback) {
        if (
          chunk.ticker &&
          chunk.date &&
          chunk.close &&
          chunk.volume !== undefined &&
          chunk.date === dateToUse
        ) {
          try {
            const openPrice = parseFloat(chunk.open || '0');
            const highPrice = parseFloat(chunk.high || '0');
            const lowPrice = parseFloat(chunk.low || '0');
            const closePrice = parseFloat(chunk.close); // close is mandatory based on check above
            const volumeVal = parseInt(chunk.volume || '0', 10);
            const closeAdjPrice = parseFloat(chunk.closeadj || chunk.close); // Fallback to close if closeadj is missing/invalid
            const closeUnadjPrice = parseFloat(chunk.closeunadj || chunk.close); // Fallback to close if closeunadj is missing/invalid

            // Check for NaN after parsing critical fields
            if (isNaN(openPrice) || isNaN(highPrice) || isNaN(lowPrice) || isNaN(closePrice) || isNaN(volumeVal) || isNaN(closeAdjPrice) || isNaN(closeUnadjPrice)) {
              console.warn(`Skipping record due to NaN value after parsing for ticker ${chunk.ticker} on date ${chunk.date}. Record:`, chunk);
              callback();
              return;
            }

            const equityPrice: EquityPriceData = {
              ticker: chunk.ticker,
              date: chunk.date,
              open: openPrice,
              high: highPrice,
              low: lowPrice,
              close: closePrice,
              volume: volumeVal,
              closeadj: closeAdjPrice,
              closeunadj: closeUnadjPrice,
              lastupdated: chunk.lastupdated || new Date().toISOString(), // Provide a default if lastupdated is missing
            };
            this.push(equityPrice);
          } catch (error) {
            console.error(`Error processing data for ticker ${chunk.ticker} on date ${chunk.date}:`, error);
            // Decide if this error should stop the callback or just be logged.
            // For now, we log and continue.
          }
        } else if (chunk.date === dateToUse && (!chunk.ticker || !chunk.close || chunk.volume === undefined)) {
            // Log records that match the date but are missing essential fields
            console.warn(`Skipping record for date ${dateToUse} due to missing ticker, close price, or volume. Record:`, chunk);
        }
        callback();
      },
    });

    readCsvFile(pathToRead)
      .then(csvData => parseCsvData<EquityPriceCsvRecord>(csvData))
      .then(records => {
        records.forEach(chunk => dataTransformer.write(chunk));
        dataTransformer.end();
      })
      .catch(reject);

    dataTransformer
      .on('data', (data: EquityPriceData) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// This block ensures the importEquityPrices function is called only when the script is run directly
if (require.main === module) {
  const csvFilePathToUse = EQUITY_PRICE_CSV_FILE_PATH; 
  const dateToImport = TARGET_DATE; 
  console.log(`Executing importEquityPrices for date: ${dateToImport} from file: ${csvFilePathToUse}`);
  importEquityPrices(csvFilePathToUse, dateToImport)
    .then((equityPrices) => {
      console.log(`Imported ${equityPrices.length} equity price records for ${dateToImport}`);
      // console.log(equityPrices); // Uncomment to see the data
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error running importEquityPrices script:', error);
      process.exit(1);
    });
}
