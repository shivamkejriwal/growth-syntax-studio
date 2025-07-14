import * as fs from 'fs';
import path from 'path';

// Configurable paths
const zacksPath = path.resolve(__dirname, 'zacks_data.json');
const barsPath = path.resolve(__dirname, '../src/services/nasdaqDataLink/sample-data/bars.json');
const TICKER = 'PII'; // Change as needed

function randomizeAround(value: number, percent: number = 0.02) {
    const delta = value * percent;
    return value + (Math.random() - 0.5) * 2 * delta;
}

function dateToISO(dateStr: string): string {
    // Converts MM/DD/YY to YYYY-MM-DD
    const [mm, dd, yy] = dateStr.split('/');
    const year = parseInt(yy, 10) > 50 ? '19' + yy : '20' + yy;
    return `${year}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

function convertDailyPriceToBars(dailyPrice: Record<string, string>, ticker: string) {
    return Object.entries(dailyPrice).map(([date, closeStr]) => {
        const close = parseFloat(closeStr);
        const open = randomizeAround(close, 0.01);
        const high = Math.max(open, close) + Math.random() * 0.5;
        const low = Math.min(open, close) - Math.random() * 0.5;
        const volume = Math.floor(1000000 + Math.random() * 500000);
        return {
            date: dateToISO(date),
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2)),
            volume,
            symbol: ticker
        };
    });
}

function main() {
    const zacksRaw = fs.readFileSync(zacksPath, 'utf-8');
    const barsRaw = fs.readFileSync(barsPath, 'utf-8');
    const zacksData = JSON.parse(zacksRaw);
    const barsData = JSON.parse(barsRaw);

    const newBars = convertDailyPriceToBars(zacksData.daily_price, TICKER);

    // Append new bars
    const combinedBars = Array.isArray(barsData) ? barsData.concat(newBars) : newBars;
    fs.writeFileSync(barsPath, JSON.stringify(combinedBars, null, 2));
    console.log(`Appended ${newBars.length} bars to bars.json.`);
}

main();
