const
    mongoose = require('mongoose');

const 
    bookmarkSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        user: {
            id: String,
        },
        bookmark: {
            title: String,
            link: String,
            description: String,
            thumbnail: String,
            dateAdded: Date,
            recent: Boolean
        }
    });

module.exports = mongoose.model('BookmarkSchema', bookmarkSchema);