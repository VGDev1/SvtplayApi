// const autofetch = require('./controllers/cache');
import express from 'express';
import compression from 'compression';
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

    app.use('/', index);
    // launch middleware
    loaders.app(app);
    errorHandler.app(app);

    // auto fetch and cache the response
    // autofetch.cache();
}
startServer().catch(e => console.error(e));

module.exports = app;
