// const autofetch = require('./controllers/cache');
import express from 'express';
import index from './routes';
import loaders from './loaders/express';
import errorHandler from './loaders/errorHandler';

// const express = require('express');

const app = express();

async function startServer() {
    app.use('/', index);
    // launch middleware
    loaders.app(app);
    errorHandler.app(app);

    // auto fetch and cache the response
    // autofetch.cache();
}
startServer().catch(e => console.error(e));

module.exports = app;
