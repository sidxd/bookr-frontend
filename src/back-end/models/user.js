/* eslint-disable indent */

const
     mongoose = require('mongoose');

const 
     userSchema = mongoose.Schema({
         _id: mongoose.Schema.Types.ObjectId,
         user: {
             email: Array,
             id: String,
         }
     });

module.exports = mongoose.model('UserSchema', userSchema);