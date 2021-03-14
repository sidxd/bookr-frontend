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
     { auth, requiresAuth } = require('express-openid-connect'),
     bodyParser = require('body-parser');

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
                .use(bodyParser.json())
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

             /* ROUTES: */
             app
                .use(bookmark);

             /* CUSTOM AUTH0 REDIRECTS.: */ // CAN BE CUSTOMIZED LATER.
             app
                .get('/api/v1/auth/login', (request, response) => response.oidc.login({ returnTo: '/' }))
                .get('/api/v1/auth/logout', (request, response) => response.oidc.login({ returnTo: '/' }))

                .get('/', (request, response) => {
                    response.send(request.oidc.isAuthenticated() ? 'Successfully logged in!' : 'Successfully logged out!');
                });
            
             app
                .listen(process.env.SERVER_PORT, () => {
                    console.log('The server has started!');
                });
    });