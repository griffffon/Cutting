/**
 * Created by gzelinskiy on 08.12.16.
 */
var async = require('async');
var mysql = require('mysql');
var config = require("../config/config");

var log4js = require('log4js');
log4js.configure(config.get('logger'));
var eLogger = log4js.getLogger('errors-logger');
var iLogger = log4js.getLogger('info-logger');
eLogger.setLevel('ERROR');
iLogger.setLevel('INFO');

function executeQuery(query, callback) {
    var connection = mysql.createConnection({
        host    : config.get("mysql:host"),
        database: config.get("mysql:database"),
        user    : config.get("mysql:user"),
        password: config.get("mysql:password")
    });

    async.waterfall([
        function(callback_loc) {
            connection.connect(function(err) {
                if (err) {
                    eLogger.error('error connecting: ' + err.stack);
                    callback_loc(err);
                } else {
                    console.log('Connection opened');
                    callback_loc(null);
                }
            });
        },
        function(callback_loc) {
            connection.query(query, function(err, rows, fields) {
                if (err) {
                    eLogger.error('error query execution: ' + err.stack);
                    callback_loc(err, null);
                } else {
                    var result = {
                        rows  : rows,
                        fields: fields
                    };

                    console.log('Query executed');
                    callback_loc(null, result);
                }
            });
        },
        function(result, callback_loc) {
            connection.end(function(err) {
                if (err) {
                    eLogger.error('error query execution: ' + err.stack);
                    callback_loc(err, null);
                } else {
                    console.info('Connection closed');
                    callback_loc(null, result);
                }
            });
        }
    ], function(err, results) {
        callback(err, results);
    });
}

exports.executeQuery = executeQuery;