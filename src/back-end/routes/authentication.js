const
    /* DEPENDENCIES: */
    express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    { v4: uuidv4 } = require('uuid'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth20').Strategy,
    cookieSession = require('cookie-session'),
     
    /* MIDDLEWARE: */

    /* MONGOOSE MODELS: */
    User = require('../models/user');

passport
    .use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/v1/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        User
            .findOneAndUpdate({
                user: { id: profile.id }
            }, {
                _id: new mongoose.Types.ObjectId,
                user: {
                    email: profile.emails,
                    id: profile.id
                }
            }, {
                upsert: true,
                new: true,

            }).then((user) => {
                
                done(null, user);
            });
    }));

passport
    .serializeUser((user, done) => {
        done(null, user.id);
    });

passport
    .deserializeUser((id, done) => {
        User.findById(id).then((user) => {
            done(null, user);
        });
    });

router
    .use(cookieSession({
        maxAge: 24*60*60*1000,
        keys: [ uuidv4() ]
    }))
    .use(passport.initialize())
    .use(passport.session());

router
    .get('/api/v1/auth/google/login', passport.authenticate('google', {
        scope: ['profile', 'email']
    }))
    .get('/api/v1/auth/google/redirect', passport.authenticate('google'), (request, response) => {
        response.send('Successfully logged in!');
    })
    .get('/api/v1/auth/google/logout', (request, response) => {
        request.logOut();
        response.send('Successfully logged out!');
    });

module.exports = router;