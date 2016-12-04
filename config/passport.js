var LocalStrategy = require('passport-local').Strategy;

//var User = require('../models/user').User;
var crypto = require('crypto');

module.exports = function(passport) {

// passport session setup ==================================================

    /**
     * Serialize the user, determine what data is stored in session
     * done(null, user.id); - req.session.passport.user = {id: "user_id"}
     */
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    /**
     * Deserealize the user
     */
    passport.deserializeUser(function(id, done) {
        /*User.findById(id)
            .populate('plan')
            .exec(function(err, user) {
                done(err, user);
            });*/
    });

// LOCAL LOGIN =============================================================
    passport.use('local-login', new LocalStrategy({
            usernameField    : 'email',
            passwordField    : 'password',
            passReqToCallback: true // pass in the request from route (check if a user is logged in or not)
        },
        function(req, email, password, done) {
            if (email)
                email = email.toLowerCase().trim();

            // asynchronous
            process.nextTick(function() {
                /*User.findOne({'email': email}, function(err, user) {
                    if (err)
                        return done(err);

                    // if no user is found, return the message
                    if (!user) {
                        return done(null, false, req.flash('loginMessage', 'Пользователь не найден.'));
                    }

                    if (user && !user.paid) {
                        return done(null, false, req.flash('loginMessage', 'Вы не прошли регистрацию. Пожалуйста, перейдите по ссылке в письме и зарегистрируйтесь'));
                    }

                    if (user && (user.status === 'blocked')) {
                        return done(null, false, req.flash('loginMessage', 'Ваш аккаунт был заблокирован. Обратитесь в нашу поддержку'));
                    }

                    if (!user.validPassword(password)) {
                        return done(null, false, req.flash('loginMessage', 'Неправильный пароль!'));
                    }

                    // all is well, return user
                    else {
                        return done(null, user);

                    }
                });*/
            });

        }));
};