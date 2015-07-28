'use strict';
var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    swig = require('swig'),
    Ouch = require('ouch'),
    config = require('./config/config');

// the main framework
var app = express();

// load all config variables
app.locals = config;

// view engine setup
app.engine('twig', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// always disable expressjs caching in favor of swig caching
app.set('view cache', false);

// set environment depending variables
if (app.get('env') === 'development') {
    swig.setDefaults({cache: false});

    app.use(function (e, req, res, next) {
        var ouchInstance = (new Ouch).pushHandler(
            new Ouch.handlers.PrettyPageHandler('blue', null, 'sublime')
        );
        ouchInstance.handleException(e, req, res, function (output) {
            console.log(e.stack)
        });
    });
} else {
    swig.setDefaults({cache: 'memory'});

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('templates/error', {
            message: err.message,
            error: {}
        });
    });
}

// routes
var routes = require('./routes/index');

app.use('/', routes);


module.exports = app;
