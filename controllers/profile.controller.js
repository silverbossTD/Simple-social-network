const User          = require('../models/User');
const Post          = require('../models/Post');
const Comment       = require('../models/Comment');

const bcrypt        = require('bcrypt');
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

function userPost(req, res, idUser, infomation, yourInfomation) {
    Post.find({ userid: idUser})
        .then(posts => {
            posts = posts.map(post => post.toObject());
            posts.sort(function(a,b){
              return new Date(b.date) - new Date(a.date);
            });
            res.render('profileUser', {
                title: 'Profile',
                logout: true,
                infomation: yourInfomation,
                userInfomation: infomation,
                posts: posts
            });
        });
}

class ProfileController {
    async edit(req, res, next) {
        let success = [], errors = [], idUser = req.cookies.userId;
        const user = await User.find({ id: idUser });

        if (!user) {
            res.redirect('/auth/login');
            return;
        }
        
        let infomation = user[0];
        const validPassword = await bcrypt.compare(req.body.password, user[0].password);

        if (!validPassword) {
            success = [], errors = [];
            errors.push('Please type the password');
            updateProfile(req, res, infomation, success, errors);
            return;
        }

        await User.updateOne({ id: idUser}, {description: req.body.description})
        .then(() => {
            success = [], errors = [];
            infomation.description = req.body.description;
            success.push('Profile change completed');
            updateProfile(req, res, infomation, success, errors);
        })
        .catch(next);
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
        let yourInfomation;
        await User.find({ id: req.cookies.userId })
        .then((user) => {yourInfomation = user[0]})
        .then(() => {
            User.find({ id: idUser }, (err, user) => {
                if (user.length) {
                    const infomation = user[0];
                    userPost(req, res, idUser, infomation, yourInfomation);
                }
            });
        });
    }
}

module.exports = new ProfileController();
