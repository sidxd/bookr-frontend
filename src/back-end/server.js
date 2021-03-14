/* eslint-disable indent */
/* eslint-disable no-extra-semi */

/* DEV-DEPENDENCIES */
require('dotenv')
    .config({ path: '../../.env' });

/* DEPENDENCIES: */
const
     express = require('express'),
     mongoose = require('mongoose'),
     { nanoid } = require('nanoid'),

     /* MIDDLEWARE: */
     { auth, requiresAuth } = require('express-openid-connect'),
     session = require('express-session');

/* ROUTES: */
const
     bookmark = require('./routes/bookmark');

mongoose
    .connect(process.env.MONGOOSE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        const
             app = express();

             /* MIDDLEWARE: */
             app
                .use(auth({
                    routes: {
                        login: false,
                        logout: false
                    },
                    authRequired: false,
                    auth0Logout: true,
                    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
                    baseURL: process.env.AUTH0_BASE_URL,
                    clientID: process.env.AUTH0_CLIENT_ID,
                    secret: process.env.AUTH0_SECRET
                }));

            //  app
            //     .use(session({
            //         secret: nanoid(),
            //         resave: false,
            //         saveUninitialized: false
            //     }));

             /* CUSTOM AUTH0 REDIRECTS.: */ // CAN BE CUSTOMIZED LATER.
             app
                .get('/api/v1/auth/login', (request, response) => response.oidc.login({ returnTo: '/' }))
                .get('/api/v1/auth/logout', (request, response) => response.oidc.logout({ returnTo: '/' }))

                .get('/', (request, response) => {
                    /* TODO: authentication. */
                    // when the user is authenticated, generate a token that will be used for them to send post request's to the server.
                    // this token then will be destroyed from the client when they logged out, and will be retrieved from the database when their logged in.
                                        
                    response.send(request.oidc.isAuthenticated() ? 'Successfully logged in!' : 'Successfully logged out!');
                });

             /* ROUTES: */
             app
                .use(bookmark);
            
             app
                .listen(process.env.SERVER_PORT, () => {
                    console.log('The server has started!');
                });
    });