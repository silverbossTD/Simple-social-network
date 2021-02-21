const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const User = new Schema({
    id:            {type: String},
    username:      {type: String},
    email:         {type: String},
    password:      {type: String},
    description:   {type: String},
    date:          {type: Date, default: Date.now},
    avatar:        {type: String, default: '/images/upload/noavatar.png'}
});

module.exports = mongoose.model('User', User);
