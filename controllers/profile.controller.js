const User          = require('../models/User');
const Post          = require('../models/Post');
const Comment       = require('../models/Comment');

const imgur         = require('imgur-upload');
const path          = require('path');
const myClientID    = "368efbb07588b30";

const shortid       = require('shortid');

imgur.setClientID(myClientID);

function updateProfile(req, res, infomation, success, errors) {
    res.render('profile', {
        title: 'Profile',
        logout: true,
        infomation: infomation,
        success: success,
        errors: errors
    });
}

function userPost(req, res, idUser, infomation) {
    Post.find({ userid: idUser})
        .then(posts => {
            posts = posts.map(post => post.toObject());
            posts.sort(function(a,b){
              return new Date(b.date) - new Date(a.date);
            });
            res.render('profileUser', {
                title: 'Profile',
                logout: true,
                infomation: infomation,
                posts: posts
            });
        });
}

class ProfileController {
    async edit(req, res, next) {
        let success = [], errors = [];
        const idUser = req.cookies.userId;
        await User.find({ id: idUser }, (err, user) => {
            if (user.length) {
                if (req.body.password && req.body.password === user[0].password) {
                    User.updateOne({ id: idUser}, req.body)
                    .then(() => {
                        success = [], errors = [];
                        success.push('Profile change completed');
                        const { _id, id, username, email, password, description, avatar } = user[0];
                        const infomation = [ _id, id, req.body.username, email, password, req.body.description, avatar ];
                        updateProfile(req, res, infomation, success, errors);
                    })
                    .catch(next);
                } else {
                    success = [], errors = [];
                    const { _id, id, username, email, password, description, avatar } = user[0];
                    const infomation = [ _id, id, username, email, password, description, avatar ];
                    errors.push('Please type the password');
                    updateProfile(req, res, infomation, success, errors);
                    return;
                }
            } else {
                res.redirect('/auth/login');
                return;
            }
        });
    }
    async updateAvatar(req, res, next) {
        const idUser = req.cookies.userId;
        if (req.files) {
            let file = req.files.avatar;
            let filename = shortid.generate() + '.png';
            let uploadDir = './public/images/upload/';

            await file.mv(uploadDir + filename);
            await imgur.upload(uploadDir + filename, (err, respone) => {
                User.updateOne({ id: idUser }, { avatar: `${respone.data.link}` })
                .then(() => Post.updateMany({userid: idUser},{avatar: `${respone.data.link}` }, {multi: true}))
                .then(() => Comment.updateMany({userid: idUser}, {avatar: `${respone.data.link}` }, {multi: true}))
                .then(() => res.redirect('/profile'));
            });
        }
    }
    async profileUser(req, res, next) {
        const idUser = req.params.id;
        await User.find({ id: idUser }, (err, user) => {
            if (user.length) {
                const { _id, id, username, email, password, description, avatar } = user[0];
                const infomation = [ _id, id, username, email, password, description, avatar ];
                userPost(req, res, idUser, infomation);
            }
        });
    }
}

module.exports = new ProfileController();
