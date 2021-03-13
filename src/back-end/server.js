/* eslint-disable indent */
/* eslint-disable no-extra-semi */

/* DEPENDENCIES: */
const
    dotenv = require('dotenv')
        .config({ path: '../../.env' }),
    express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

/* ROUTES: */
const
     bookmark = require('./routes/bookmark'),
     authGoogle = require('./routes/authentication');

const
     URI = `mongodb+srv://admin:${process.env.MONGOOSE_PW}@bookr0.bchzj.mongodb.net/testing?retryWrites=true&w=majority`,
     port = process.env.PORT || 6969;

mongoose
    .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        const
             app = express();

             /* MIDDLEWARE: */
             app
                .use(bodyParser.json());

             /* ROUTES: */
             app
                .use(bookmark)
                .use(authGoogle);

             app
                .listen(process.env.PORT || port, () => {
                    console.log('The server has started!');
                });
    });