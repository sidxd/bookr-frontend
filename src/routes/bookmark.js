const
    express = require('express'),
    router = express.Router(),

    mongoose = require('mongoose'),

    jwt = require('jsonwebtoken'),
    /* MIDDLEWARE: */

    /* MONGOOSE MODELS: */
    Bookmark = require('../models/bookmark'),
    /* MONGOOSE MODELS: */
    User = require('../models/user');

/* MIDDLEWARE: */

router
    .post('/api/v1/bookmark', (request, response) => {
        const { token, title, link, description, thumbnail } = request.body;
        
        User
            .findOneAndUpdate(
                {
                    'user.token': token
                }, 
                {
                    $push: {
                        'user.bookmarks': {
                            title: title,
                            link: link,
                            description: description,
                            thumbnail: thumbnail
                        }
                    }
                },
                {
                    new: true
                }).then((document) => {
                if(!document) return response.status(404).send('Token is not associated with any user!.');
    
                response.status(200).send('OK!');
            });
    });

module.exports = router;