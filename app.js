var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var index = require('./routes/index');

var app = express();

var url = process.env.MONGO_URL;
console.log(url);   // to check

MongoClient.connect(url, function(err, db) {
    { assert.equal(null, err);
        console.log('connection successful');
    }

    app.use('/', function(req, res, next) {
        req.db = db;
        next();
    });
    app.use('/', index);

    // 404 error catcher.
    app.use(function(req, res, next) {
        var err = new Error('Not found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs({ extname: '.hbs', defaultLayout: 'layout'}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// dev error handler for displaying stacktrace.
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// prod error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
