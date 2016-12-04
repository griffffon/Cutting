/**
 * Created by Grigoriy on 24.06.2016.
 */
var config = require('../config/config');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        var now = new Date();
        if ((((new Date(req.user.accessTo)) < now) || (req.user.status === 'refund')) ||
            (((new Date(req.user.accessTo)) < now) && (req.user.status === 'refund'))) {
            res.redirect('/payment');
        } else if (req.user.status === 'blocked') {
            req.logout();
            res.redirect('/');
        } else {
            next();
        }
    } else {
        req.session.redirectTo = req.originalUrl;
        res.redirect('/');
    }
}

function isLoggedInPayment(req, res, next) {
    if (req.url.indexOf('/callbacks') > -1) {
        next();
    } else {
        if (req.isAuthenticated()) {
            if (req.user.status === 'blocked') {
                req.logout();
                res.redirect('/');
            } else {
                next();
            }
        } else {
            req.session.redirectTo = req.originalUrl;
            res.redirect('/');
        }
    }
}

function isLoggedInAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
            res.status(404);
            res.render('error404', {url: '/admin' + req.url});
        } else {
            next();
        }
    } else {
        req.session.redirectTo = req.originalUrl;
        res.redirect('/');
    }
}

function accessToCommonPages(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/feed');
    } else {
        next();
    }
}

exports.isLoggedIn = isLoggedIn;
exports.isLoggedInPayment = isLoggedInPayment;
exports.isLoggedInAdmin = isLoggedInAdmin;
exports.accessToCommonPages = accessToCommonPages;