/* DEV-DEPENDENCIES */
require('dotenv')
    .config({ path: '../../.env' });

const
    /* DEPENDENCIES: */
    mongoose = require('mongoose'),
    express = require('express'),

    /* MIDDLEWARE: */

    /* ROUTES: */
    authentication = require('./routes/authentication'),
    bookmark = require('./routes/bookmark');

/* MONGOOSE MODELS: */

mongoose
    .connect(process.env.MONGOOSE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        const
            app = express();

        /* MIDDLEWARE: */

        /* ROUTES: */
        app
            .use(authentication)
            .use(bookmark);
            
        app
            .listen(process.env.SERVER_PORT, () => {
                console.log('The server has started!');
            });

        /* TESTING: */
    });