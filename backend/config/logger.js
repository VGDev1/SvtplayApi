const winston = require('winston');

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
        winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: './logs/app_info.log', level: 'info' }),
        new winston.transports.File({ filename: './logs/app_err.log', level: 'error' }),
    ],
});

module.exports = logger;
