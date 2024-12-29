const { exec } = require('child_process');
const path = require('path');

async function processFileWithCNN(filePath) {
  return new Promise((resolve, reject) => {
    // Path to the Python script
    const scriptPath = path.join(__dirname, 'predict.py');

    // Command to execute Python script
    const command = `python ${scriptPath} ${filePath}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running Python script: ${error.message}`);
        return reject(error);
      }

      if (stderr) {
        console.error(`Python script stderr: ${stderr}`);
        return reject(stderr);
      }

      console.log(`Python script output: ${stdout}`);
      resolve(stdout.trim());
    });
  });
}

module.exports = { processFileWithCNN };
