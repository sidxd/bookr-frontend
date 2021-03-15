/* eslint-disable indent */
/* eslint-disable no-extra-semi */

/* DEV-DEPENDENCIES */
require('dotenv')
    .config({ path: '../../.env' });

const
     /* DEPENDENCIES: */
     mongoose = require('mongoose'),
     express = require('express'),
     { v4: uuidv4 } = require('uuid'),

     /* MIDDLEWARE: */

     /* ROUTES: */
     bookmark = require('./routes/bookmark'),

     /* MONGOOSE MODELS: */
     User = require('./models/user');

mongoose
    .connect(process.env.MONGOOSE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        const
             app = express(),
             passport = require('passport'),
             GoogleStrategy = require('passport-google-oauth20').Strategy,
             cookieSession = require('cookie-session');

             /* MIDDLEWARE: */

             passport
                .use(new GoogleStrategy({
                    clientID: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    callbackURL: '/api/v1/auth/google/redirect'
                }, (accessToken, refreshToken, profile, done) => {
                    User
                        .findOne({ user: { id: profile.id } })
                            .then((user) => {
                                if(!user) {
                                    return new User({
                                        _id: new mongoose.Types.ObjectId,
                                        user: {
                                            email: profile.emails,
                                            id: profile.id
                                        }
                                    }).save().then((nu) =>{
                                        done(null, nu);
                                    });
                                };

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

                app
                    .use(cookieSession({
                        maxAge: 24*60*60*1000,
                        keys: [ uuidv4() ]
                    }))
                    .use(passport.initialize())
                    .use(passport.session());

             app
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

             /* ROUTES: */
             app
                .use(bookmark);
            
             app
                .listen(process.env.SERVER_PORT, () => {
                    console.log('The server has started!');
                });

            /* TESTING: */
    });