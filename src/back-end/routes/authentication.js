/* eslint-disable quotes */
/* eslint-disable indent */

const
     express = require('express'),
     router = express.Router(),

     passport = require("passport"),
     GoogleStrategy = require("passport-google-oauth20").Strategy,
     cookieSession = require('cookie-session'),

     dotenv = require('dotenv')
        .config({ path: '../../.env' });

router
    .use(cookieSession({
        maxAge: 24 * 60 * 60 * 1000,
            keys: ['Hello, World!']
    }));

router
    .use(passport.initialize())
    .use(passport.session());

passport
    .use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/v1/auth/redirect/'
    }, (refreshToken, accessToken, profile, done) => {
        console.log(profile);
        done(null, profile);
    }));

passport
    .serializeUser((user, done) => {
    done(null, user);
});

passport
    .deserializeUser((user, done) => {
    done(null, user);
});

router
    .get('/api/v1/auth/google/', passport.authenticate('google', {
        scope: ['profile', 'email']
    }))
    .get('/api/v1/auth/redirect/', passport.authenticate('google'), (request, response) => {
        response.send(request.user);
        response.send('Successfully logged in! You can now close this window.');
    });
    
module.exports = router;