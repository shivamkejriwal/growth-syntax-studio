
const { spawn } = require('child_process');
const path = require('path');

// Construct the absolute path to the .ts script in src/services
const scriptPath = path.resolve(__dirname, '../src/services/importCompaniesFromCsv.ts');

console.log(`Executing ${scriptPath} with tsx...`);

const child = spawn('npx', ['tsx', scriptPath], {
  stdio: 'inherit', // Inherit stdio to see console output from the script
  shell: process.platform === 'win32', // Use shell on Windows for npx
});

child.on('error', (error) => {
  console.error(`Failed to start subprocess for importCompaniesFromCsv.ts: ${error.message}`);
  process.exit(1);
});

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`tsx script importCompaniesFromCsv.ts exited with code ${code}`);
  } else {
    console.log('tsx script importCompaniesFromCsv.ts finished successfully.');
  }
  process.exit(code === null ? 1 : code);
});
