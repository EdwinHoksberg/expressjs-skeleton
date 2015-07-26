var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    swig = require('swig'),
    Ouch = require('ouch');

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
    swig.setDefaults({ cache: 'memory' });
}

// uncomment after placing your favicon in /public/icons
//app.use(favicon(path.join(__dirname, 'public/icons', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

if (app.get('env') === 'development') {
    app.use(function (e, req, res, next) {
        var ouchInstance = (new Ouch).pushHandler(
            new Ouch.handlers.PrettyPageHandler('blue', null, 'sublime')
        );
        ouchInstance.handleException(e, req, res, function (output) {
            console.log('Error handled properly')
        });
    });
} else {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

module.exports = app;
