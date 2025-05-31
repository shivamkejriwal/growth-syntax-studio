import { parseCsvData, type CsvRecord, createCsvTransform, processCsvWithTransform } from './csvUtils';
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
  const pathToRead = filePath || EQUITY_PRICE_CSV_FILE_PATH;
  const dateToUse = targetDate || TARGET_DATE;

  const dataTransformer = createCsvTransform<EquityPriceCsvRecord, EquityPriceData>((chunk, push, callback) => {
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
        const closePrice = parseFloat(chunk.close);
        const volumeVal = parseInt(chunk.volume || '0', 10);
        const closeAdjPrice = parseFloat(chunk.closeadj || chunk.close);
        const closeUnadjPrice = parseFloat(chunk.closeunadj || chunk.close);

        if (
          isNaN(openPrice) ||
          isNaN(highPrice) ||
          isNaN(lowPrice) ||
          isNaN(closePrice) ||
          isNaN(volumeVal) ||
          isNaN(closeAdjPrice) ||
          isNaN(closeUnadjPrice)
        ) {
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
          lastupdated: chunk.lastupdated || new Date().toISOString(),
        };
        push(equityPrice);
      } catch (error) {
        console.error(`Error processing data for ticker ${chunk.ticker} on date ${chunk.date}:`, error);
      }
    } else if (chunk.date === dateToUse && (!chunk.ticker || !chunk.close || chunk.volume === undefined)) {
      console.warn(`Skipping record for date ${dateToUse} due to missing ticker, close price, or volume. Record:`, chunk);
    }
    callback();
  });

  return processCsvWithTransform<EquityPriceCsvRecord, EquityPriceData>(
    pathToRead,
    parseCsvData,
    dataTransformer
  );
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
