/* eslint-disable quotes */
/* eslint-disable indent */

const
     dotenv = require('dotenv').config({ path: '../../.env' }),

     express = require('express'),
     router = express.Router(),

     passport = require("passport"),
     GoogleStrategy = require("passport-google-oauth20").Strategy,

     cookieSession = require('cookie-session');

router.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.KEY]
}));

router
    .use(passport.initialize())
    .use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/v1/auth/redirect'
}, (refreshToken, accessToken, profile, done) => {
    done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

/* write a middleware here to check if the user is logged in. */
const isUserLoggedIn = (request, response, next) => {
    if(!request.user) return response.send('You must log in to continue!');
    
    next();
};

router
    .get('/api/v1/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }))
    .get('/api/v1/auth/redirect', passport.authenticate('google'), (request, response) => {
        response.redirect('/api/v1/auth/success');
    })
    .get('/api/v1/auth/success', isUserLoggedIn, (request, response) => {
        response.send('Successfully logged in! You can now close this window.');
    })
    .get('/api/v1/auth/logout', (request, response) => {
        request.logout();
        response.redirect('/');
    });
    
module.exports = router;