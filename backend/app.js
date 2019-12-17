// const autofetch = require('./controllers/cache');
import express from 'express';
import compression from 'compression';
import logger from './config/logger';
import index from './routes';
import loaders from './loaders/express';
import errorHandler from './loaders/errorHandler';
import { autoCache } from './services/cache';

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
    autoCache().catch(e => console.error(e.message));
}
startServer().catch(e => logger.error(e.message));

module.exports = app;
