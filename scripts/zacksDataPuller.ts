import axios from 'axios';
import * as fs from 'fs';


interface ZacksResponse {
    [key: string]: any; // Adjust the type based on the actual response structure
}

async function getZacksData(ticker: string, timePeriods: number[]): Promise<ZacksResponse | null> {
    const baseUrl = "https://www.zacks.com//data_handler/charts/";
    const timePeriodStr = timePeriods.join(",");
    const url = `${baseUrl}?ticker=${ticker}&wrapper=price_and_eps_estimates_consensus&addl_settings=time_period=${timePeriodStr}`;

    try {
        const response = await axios.get<ZacksResponse>(url);
        response.data
        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.data;
    } catch (error: any) {
        console.error("Failed to retrieve or parse data:", error.message);
        return null;
    }
}

async function main() {
    const tickerSymbol = process.argv[2];
    const timePeriodInput = process.argv[3] || "2023,2024,2025"; // Default to 2023, 2024, 2025 if not provided
    const outputPath = 'zacks_data.json';  // Output file name, you can make this configurable

    if (!tickerSymbol || !timePeriodInput) {
        console.log("Usage: ts-node zacksDataPuller.ts <ticker> <time_periods>");
        console.log("Example: ts-node zacksDataPuller.ts AAPL 2023,2024,2025");
        return;
    }

    try {
        const timePeriodsList = timePeriodInput.split(",").map(year => parseInt(year, 10));
        const data = await getZacksData(tickerSymbol, timePeriodsList);

        if (data) {
            console.log(JSON.stringify(data, null, 2));
            fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
            console.log(`Data for ${tickerSymbol} saved to ${outputPath}`);
        } else {
            console.log("Failed to retrieve or parse data.");
        }
    } catch (error: any) {
        console.error("An unexpected error occurred:", error.message);
    }
}

main();