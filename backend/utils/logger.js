const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');

const logDir = path.join(__dirname, '../logs');

// Create the logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: path.join(logDir, 'access.log') }),
  ],
});

module.exports = logger;
