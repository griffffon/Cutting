/**
 * Created by Grigoriy on 18.04.2016.
 */
var config = require('./config/config');
var cluster = require('cluster');
var num_processes = require('os').cpus().length;
var net = require('net');
// require('sticky-socket-cluster/replace-console')();
// prefixes console output with worker ids.

if (cluster.isMaster) {
    // This stores our workers. We need to keep them to be able to reference
    // them based on source IP address. It's also useful for auto-restart,
    // for example.
    var workers = [];

    // Helper function for spawning worker at index 'i'.
    var spawn = function (i) {
        workers[i] = cluster.fork();

        // Optional: Restart worker on exit
        workers[i].on('exit', function (worker, code, signal) {
            console.log('respawning worker', i);
            spawn(i);
        });
    };

    // Spawn workers.
    for (var i = 0; i < num_processes; i++) {
        spawn(i);
    }

    // Helper function for getting a worker index based on IP address.
    // This is a hot path so it should be really fast. The way it works
    // is by converting the IP address to a number by removing the dots,
    // then compressing it to the number of slots we have.
    //
    // Compared against "real" hashing (from the sticky-session code) and
    // "real" IP number conversion, this function is on par in terms of
    // worker index distribution only much faster.
    var worker_index = function (ip, len) {
        var s = '';
        for (var i = 0, _len = ip.length; i < _len; i++) {
            if (ip[i] !== '.') {
                s += ip[i];
            }
        }

        return Number(s) % len;
    };

    function getWorker(ip, len) {
        var _ip = ip.split(/['.'|':']/),
            arr = [];

        for (el in _ip) {
            if (_ip[el] == '') {
                arr.push(0);
            } else {
                arr.push(parseInt(_ip[el], 16));
            }

            return Number(arr.join('')) % len;
        }
    }

    // Create the outside facing server listening on our port.
    var server = net.createServer({pauseOnConnect: true}, function (connection) {
        // We received a connection and need to pass it to the appropriate
        // worker. Get the worker for this connection's source IP and pass
        // it the connection.
        var worker = workers[getWorker(connection.remoteAddress, num_processes)];
        // var worker = workers[worker_index(connection.remoteAddress, num_processes)];
        worker.send('sticky-session:connection', connection);
    }).listen(config.get("port"));
}
else {
    var express = require('express');
    var app = express();
    var http = require('http');
    var sticky = require('sticky-session');
    var favicon = require('serve-favicon');

    //var mongoose = require('mongoose');
    var fs = require('fs');

    var passport = require('passport');
    var flash = require('connect-flash');
    var path = require('path');
    var async = require('async');

    // LOGGER =====================================
    var log4js = require('log4js');
    log4js.configure(config.get('logger'));
    var wLogger = log4js.getLogger('warnings-logger');
    wLogger.setLevel('WARN');
    var eLogger = log4js.getLogger('errors-logger');
    eLogger.setLevel('ERROR');

    var morgan = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    const session = require('express-session');
    //const MongoStore = require('connect-mongo/es5')(session);

    var server = app.listen(0, 'localhost');

    console.log('worker: ' + cluster.worker.id);
    // The worker code to be run is written inside
    // the sticky().

    app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));

    require('./config/passport')(passport); // pass passport for configuration
    // express setup ===============================================================
    app.use(morgan('dev')); // log every request to the console
    app.use(cookieParser()); // read cookies (needed for auth)
    app.use(bodyParser.json({limit: '524288000'}));
    app.use(bodyParser.urlencoded({limit: '524288000', extended: true}));
    app.use(bodyParser.raw({limit: '524288000'}));
    app.set('view engine', 'ejs');

    //passport.js setup ============================================================
    app.use(session({
        secret           : 'mySecretGeniusKey',
        resave           : true,
        saveUninitialized: true/*,
        store            : new MongoStore({
            db                : config.get('dbName'),
            mongooseConnection: mongoose.connection,
            clear_interval    : 10 * 60, //интервал очистки просроченых сессий (в секундах)
            // ttl               : 60, //время жизни сессии (в секундах) с момента последней активности юзера на сайте
            // ttl               : 24 * 7 * 60 * 60, //время жизни сессии (в секундах) с момента последней активности юзера на сайте
            autoRemove        : 'native'
        })*/
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    // routes ======================================================================
    // main controller for routes
    //var router = require('./routes/router')(app, passport); // load router.js and pass in app and passport

    // other controllers for routes for API
    /*var admin = require('./routes/admin');
    app.use('/admin', admin);*/

    // middleware for static files in "public" folder
    //app.use('/admin', express.static(__dirname + '/public'));
    app.use(express.static(__dirname + '/public'));

    // error handlers ==============================================================
    app.use(function (req, res, next) {
        if (req.url !== '/upload') {
            var err = new Error('Not Found');
            err.status = 404;
            /*  eLogger.error('url 404:' + req.url);
             eLogger.error(err);*/
            res.render('error404', {url: req.url});
        } else {
            res.sendStatus(200);
        }
    });

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        // winston.error('Internal error(%d): %s', res.statusCode, err.message);
        eLogger.error(err);
        res.render('error500', {
            code   : res.statusCode,
            message: err.message
        });
        // res.send({error: err.message});
    });

}

/*
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var router = require('./routes/router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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

module.exports = app;
*/
