// Modules needed for backend to run
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const morgan = require('morgan');
const fetch = require('node-fetch');
const logger = require('./config/logger');
require('dotenv').config('./config/.env');

// All routes.js files imported
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const usersRouter = require('./routes/users');
const proxyRouter = require('./routes/proxy');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Modules for app to use
const accessLogStream = fs.createWriteStream('./backend/logs/app_info.log', { flags: 'a' });
app.use(morgan('tiny', { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// All the routes deployed as paths
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/users', usersRouter);
app.use('/proxy', proxyRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// autofetch on start to cache immediately
((req, res, next) => {
    fetch('http://localhost:3000/api/svt/program/AO');
    fetch('http://localhost:3000/api/svt/program/populart');
    logger.info('fetch AO self INVOKED!');
})();

module.exports = app;
