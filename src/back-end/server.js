/* eslint-disable indent */
/* eslint-disable no-extra-semi */

/* DEPENDENCIES: */
const
    dotenv = require('dotenv')
        .config({ path: '../../.env' }),
    express = require('express'),
    mongoose = require('mongoose');

/* ROUTES: */
const
    bookmark = require('./routes/bookmark');

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

             app
                .use(bookmark);

             app
                .listen(process.env.PORT || port, () => {
                    console.log('The server has started!');
                });
    });