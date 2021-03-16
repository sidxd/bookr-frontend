/* eslint-disable indent */

const
     mongoose = require('mongoose');

const 
     userSchema = mongoose.Schema({
         user: {
             email: Array,
             id: String,
             token: String,
             bookmarks: Array
         }
     });

module.exports = mongoose.model('User', userSchema);