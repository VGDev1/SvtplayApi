import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import logger from '../config/logger';

exports.app = app => {
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
