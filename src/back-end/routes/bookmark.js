/* eslint-disable quotes */
/* eslint-disable indent */

const
     express = require('express'),
     mongoose = require('mongoose'),
     Bookmark = require('../models/bookmark'),
     router = express.Router();

router
    .post('/api/v1/bookmarks', (request, response) => {
        console.log('Hi!');
        const
             bookmark = new Bookmark({
                 _id: new mongoose.Types.ObjectId,
                user: {
                    id: '12390812'
                },
                bookmark: {
                    title: 'test',
                    link: 'https://google.com',
                    description: 'test',
                    thumbnail: 'test',
                    dateAdded: Date.now(),
                    recent: true
                }
        });

        bookmark
            .save()
                .then(() => {
                    console.log('Bookmark has been uploaded to the db!');
                });

        // response
        //     .json({
        //         "message": "Hello, World!"
        //     });
    });

module.exports = router;