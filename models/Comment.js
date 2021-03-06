const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const Comment = new Schema({
    post:          {type: String},
    id:            {type: String},
    userid:        {type: String},
    avatar:        {type: String, default: '/images/upload/noavatar.png'},
    username:      {type: String},
    content:       {type: String},
    date:          {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Comment', Comment);
