/**
 * Created by Grigoriy on 18.12.2015.
 */
var express = require('express');

module.exports = function(app) {
    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({extended: true, keepExtensions: true}));

    app.get('/', function(req, res) {
        res.render('pages/index');
    });

    app.get('/login', function(req, res) {
        res.render('pages/login');
    });

    app.get('/forgot', function(req, res) {
        res.render('pages/forgot');
    });
};

function isLoggedIn(req, res, next) {
    /*Тут лучше обычная проверка, без демо*/
    if (req.isAuthenticated()) {
        if ((req.user.status !== 'active') && (!((req.user.plan === 'demo') && (req.user.status === 'blocked')))) {
            req.logout();
            res.redirect('/');
        } else {
            next();
        }
    } else {
        res.redirect('/');
    }
}