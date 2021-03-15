const
    express = require('express'),
    router = express.Router(),

    mongoose = require('mongoose'),

    /* MIDDLEWARE: */

    /* MONGOOSE MODELS: */
    Bookmark = require('../models/bookmark');

/* MIDDLEWARE: */

router
    .post('/api/v1/bookmark', (request, response) => {
        console.log('Hello, World!');
        // const
        //      bookmark = new Bookmark({
        //          _id: new mongoose.Types.ObjectId,
        //         user: {
        //             id: '12390812'
        //         },
        //         bookmark: {
        //             title: 'test',
        //             link: 'https://google.com',
        //             description: 'test',
        //             thumbnail: 'test',
        //             dateAdded: Date.now(),
        //             recent: true
        //         }
        // });

        // bookmark
        //     .save()
        //         .then(() => {
        //             console.log('Bookmark has been uploaded to the db!');
        //             response.json({
        //                 "Status": 200,
        //                 "Message": 'OK'
        //             });
        //         });
    });

module.exports = router;