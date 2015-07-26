var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    swig = require('swig');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.engine('twig', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// cache templates depending on environment
// always disable expressjs caching in favor of swig caching
app.set('view cache', false);
if (app.get('env') === 'development') {
    swig.setDefaults({ cache: false });
} else {
    swig.setDefaults({ cache: true });
}

// uncomment after placing your favicon in /public/icons
//app.use(favicon(path.join(__dirname, 'public/icons', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;