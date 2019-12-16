// const autofetch = require('./controllers/cache');
import express from 'express';
import compression from 'compression';
import { logger } from 'express-winston';
import index from './routes';
import loaders from './loaders/express';
import errorHandler from './loaders/errorHandler';

// const express = require('express');

const app = express();

async function startServer() {
    // use gzip-compression
    app.use(compression());

    // Set CORS headers
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    // launch middleware
    loaders.express(app);
    app.use('/', index);
    app.use((req, res, next) => {
        if (req.originalUrl === '/favicon.ico') {
            res.writeHead(200, { 'Content-Type': 'image/x-icon' });
            return res.end();
        }
        return next();
    });
    errorHandler.app(app);

    // auto fetch and cache the response
    // autofetch.cache();
}
startServer().catch(e => logger.error(e));

module.exports = app;
