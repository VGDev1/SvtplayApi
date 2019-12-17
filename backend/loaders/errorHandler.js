import createError from 'http-errors';
import logger from '../config/logger';

exports.app = app => {
    /* catch 404 and forward to error handler
    app.use((req, res, next) => {
        next(createError(404));
    });
    */
    // error handler
    app.use((err, req, res, next) => {
        // set locals, only providing error in development
        res.locals.message = err.message;

        // render the error page
        logger.error(err.message);
        res.status(err.status || 500);
        return res.render('err');
    });
    return app;
};
