const corsProxy = require('cors-anywhere');
const logger = require('../config/logger');

// Listen on a specific host via the HOST environment variable
const host = process.env.HOST || '127.0.0.1';
// Listen on a specific port via the PORT environment variable
const port = process.env.PORT || 8080;

corsProxy
    .createServer({
        originWhitelist: [], // Allow all origins
        requireHeader: ['origin', 'x-requested-with'],
        removeHeaders: ['cookie', 'cookie2'],
    })
    .listen(port, host, () => {
        logger.info(`Cors-Proxy running on: ${host}:${port}`);
    });
