import axios from 'axios';
import * as fs from 'fs';
import path from 'path';

const ticker = process.argv[2] || 'PII';
const API_URL = `https://www.zacks.com/data_handler/charts/?ticker=${ticker}&wrapper=price&addl_settings=`;
const OUTPUT_PATH = path.resolve(__dirname, `zacks_price_data_${ticker}.json`);

async function main() {
    try {
        const response = await axios.get(API_URL);
        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(response.data, null, 2));
        console.log(`Price data for ${ticker} saved to ${OUTPUT_PATH}`);
    } catch (error: any) {
        console.error('Failed to fetch or save price data:', error.message);
    }
}

main();
