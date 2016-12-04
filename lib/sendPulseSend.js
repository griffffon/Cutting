/**
 * Created by Grigoriy on 02.09.2016.
 */
var config = require('../config/config');
var iLogger = require('./logger').iLogger;
var sendPulse = require("./sendpulse.js");

sendPulse.init(config.get('sendPulse:API_USER_ID'), config.get('sendPulse:API_SECRET'));

function sendMailViaSendPulse(html, text, subject, from_name, from_email, /*to_name,*/ to_email) {
    var email = {
        "html"   : html,
        "text"   : text,
        "subject": subject,
        "from"   : {
            "name" : from_name,
            "email": from_email
        },
        "to"     : [{
            //"name" : to_name,
            "email": to_email
        }]
    };
    var answerGetter = function answerGetter(data) {
        iLogger.info(data);
    };
    sendPulse.smtpSendMail(answerGetter, email);
}

exports.sendMailViaSendPulse = sendMailViaSendPulse;