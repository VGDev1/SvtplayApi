const winston = require('winston');

// Winston logger and settings for creating log entires
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.colorize(),
                winston.format.simple(),
                winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
            ),
        }),
        new winston.transports.File({ filename: './logs/app_info.log', level: 'info' }),
        new winston.transports.File({ filename: './logs/app_err.log', level: 'error' }),
    ],
});

// stream that redirects morgan, etc to pass through Winston logger
logger.stream = {
    write(message, encoding) {
        logger.info(message);
    },
};

module.exports = logger;
