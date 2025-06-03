import { getEquitiesTickers, EQUITIES360_TABLES } from './equities360';

async function main() {
  try {
    // Example: Pull fundamental details for MSFT for the most recent quarter
    const today = new Date();
    const year = today.getFullYear();
    // Default to last quarter end (approximate)
    const quarterEndMonths = [3, 6, 9, 12];
    let month = today.getMonth() + 1;
    let quarter = Math.floor((month - 1) / 3);
    let quarterEndMonth = quarterEndMonths[quarter];
    let date = `${year}-${String(quarterEndMonth).padStart(2, '0')}-30`;

    const data = await getEquitiesTickers({
      ticker: 'MSFT',
      table: 'FUNDAMENTAL_DETAILS',
      date,
      range: '1Q',
    });
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error pulling MSFT data:', err);
    process.exit(1);
  }
}

main();
