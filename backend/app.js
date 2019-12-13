const express = require('express');
const autofetch = require('./controllers/cache');

const app = express();

async function startServer(app) {
    // Routers
    app.use('/', require('./routes/index'));
    app.use('/api', require('./routes/api'));
    app.use('/proxy', require('./routes/proxy'));
    // launch middleware
    const express = await require('./loaders/express').app(app);

    // auto fetch and cache the response
    // autofetch.cache();
}
startServer(app).catch((e) => console.error(e));
module.exports = app;
