const winston = require('winston');
const path = require('path');
const expressWinston = require('express-winston');

const logsDirectory = path.resolve(__dirname, '../logs');
const requestPath = path.join(logsDirectory, 'request.log');
const errorPath = path.join(logsDirectory, 'error.log');

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: requestPath }),
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: errorPath }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
