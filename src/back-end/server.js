/* eslint-disable indent */
/* eslint-disable no-extra-semi */

/* DEV-DEPENDENCIES */
require('dotenv')
    .config({ path: '../../.env' });

/* DEPENDENCIES: */
const
     express = require('express'),
     
     mongoose = require('mongoose'),

     /* MIDDLEWARE: */
     { auth } = require('express-openid-connect'),

     /* ROUTES: */
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

             /* CUSTOM AUTH0 REDIRECTS.: */ // CAN BE CUSTOMIZED LATER.
             app
                .get('/api/v1/auth/login', (request, response) => response.oidc.login({ returnTo: '/' }))
                .get('/api/v1/auth/logout', (request, response) => response.oidc.logout({ returnTo: '/' }))

                .get('/', (request, response) => {
                    response.send(request.oidc.isAuthenticated() ? 'Successfully logged in!' : 'Successfully logged out!');
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