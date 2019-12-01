// Modules needed for backend to run
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// All routes.js files imported
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const usersRouter = require('./routes/users');
const proxyRouter = require('./routes/proxy');
const svtapi = require('./controllers/svtplay');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Modules for app to use
app.use(logger('dev'));
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
    (svtapi.getAllPrograms = async () => {
        console.time('AUTOFETCH SELF INVOKED');
        const p1 = svtapi.getURLProxy(svtapi.programUrlSimple, 'simple').then((r) => svtapi.createSimpleJson(r));
        const p2 = svtapi.getURL(svtapi.programUrl, 'programUrl');
        const pr = Promise.all([p1, p2]);
        try {
            const p = await pr;
            const d = svtapi.createAdvancedJson(p[0], p[1]);
            console.timeEnd('AUTOFETCH SELF INVOKED');
            return svtapi.createSortedJson(d);
        } catch (e) {
            return console.error(e);
        }
    })();
})();

module.exports = app;
