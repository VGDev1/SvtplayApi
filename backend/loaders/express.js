const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const compression = require('compression');
const logger = require('../config/logger');

exports.app = app => {
    // use gzip-compression
    app.use(compression());

    // Set CORS headers
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    // view engine setup
    app.set('views', path.join(__dirname, '/../views'));
    app.set('view engine', 'pug');

    // Modules for app to use
    app.use(morgan('tiny', { stream: logger.stream }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '/../public')));

    return app;
};
