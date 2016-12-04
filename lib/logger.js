/**
 * Created by Grigoriy on 15.06.2016.
 */
var log4js = require('log4js');
var config = require('./../config/config');
log4js.configure(config.get('logger'));

var wLogger = log4js.getLogger('warnings-logger');
var eLogger = log4js.getLogger('errors-logger');
var iLogger = log4js.getLogger('info-logger');
var reverseLogger = log4js.getLogger('reverse-logger');
var autoPaymentLogger = log4js.getLogger('autoPayment-logger');
var checkStatusLogger = log4js.getLogger('status-logger');
var callbacksLogger = log4js.getLogger('callbacks-logger');
var getResponseLogger = log4js.getLogger('getResponse-logger');

wLogger.setLevel('WARN');
eLogger.setLevel('ERROR');
iLogger.setLevel('INFO');
reverseLogger.setLevel('INFO');
autoPaymentLogger.setLevel('INFO');
checkStatusLogger.setLevel('INFO');
callbacksLogger.setLevel('INFO');
getResponseLogger.setLevel('INFO');

exports.wLogger = wLogger;
exports.eLogger = eLogger;
exports.iLogger = iLogger;
exports.reverseLogger = reverseLogger;
exports.autoPaymentLogger = autoPaymentLogger;
exports.checkStatusLogger = checkStatusLogger;
exports.callbacksLogger = callbacksLogger;
exports.getResponseLogger = getResponseLogger;