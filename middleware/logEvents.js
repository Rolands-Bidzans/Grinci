const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        // Create the logs directory if it doesn't exist
        await fsPromises.mkdir(path.join(__dirname, '..', 'logs'), { recursive: true });

        // Append the log item to the eventLog.txt file
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem + '\n');
    } catch (err) {
        console.error('Error writing to log file:', err);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = { logger, logEvents };
