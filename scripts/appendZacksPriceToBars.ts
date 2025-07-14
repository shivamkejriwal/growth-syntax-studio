import * as fs from 'fs';
import path from 'path';

const zacksPricePath = path.resolve(__dirname, 'zacks_price_data.json');
const barsPath = path.resolve(__dirname, '../src/services/nasdaqDataLink/sample-data/bars.json');
const TICKER = 'PII';

function dateToISO(dateStr: string): string {
    // Converts MM/DD/YY to YYYY-MM-DD
    const [mm, dd, yy] = dateStr.split('/');
    const year = parseInt(yy, 10) > 50 ? '19' + yy : '20' + yy;
    return `${year}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

function priceMappingToBars(priceMap: Record<string, string>, ticker: string) {
    return Object.entries(priceMap).map(([date, closeStr]) => {
        const close = parseFloat(closeStr);
        return {
            date: dateToISO(date),
            open: close,
            high: close,
            low: close,
            close: close,
            volume: 0,
            symbol: ticker
        };
    });
}

function main() {
    const zacksRaw = fs.readFileSync(zacksPricePath, 'utf-8');
    const barsRaw = fs.readFileSync(barsPath, 'utf-8');
    const zacksData = JSON.parse(zacksRaw);
    const barsData = JSON.parse(barsRaw);

    const newBars = priceMappingToBars(zacksData.price, TICKER);
    const combinedBars = Array.isArray(barsData) ? barsData.concat(newBars) : newBars;
    fs.writeFileSync(barsPath, JSON.stringify(combinedBars, null, 2));
    console.log(`Appended ${newBars.length} bars to bars.json.`);
}

main();
