const User = require('../models/User');
const Post = require('../models/Post');

function displayPost(req, res, next, userid, infomation) {
    /* Display all posts */
    Post.find({})
        .then(posts => {
            posts = posts.map(post => post.toObject());
            posts.sort(function(a,b){
              return new Date(b.date) - new Date(a.date);
            });
            res.render('index', {
                title: 'Home',
                logout: true,
                userid: userid,
                posts: posts,
                infomation: infomation
            });
        })
        .catch(next);
}

class HomeController {
    async index(req, res, next) {
        const idUser = req.cookies.userId;
        await User.find({ id: idUser }, (err, user) => {
            if (user.length) {
                const infomation = user[0];
                displayPost(req, res, next, idUser, infomation);
            } else {
                res.redirect('/auth/login');
                return;
            }
        });
    }
    async profile(req, res) {
        const idUser = req.cookies.userId;
        await User.find({ id: idUser }, (err, user) => {
            if (user.length) {
                const infomation = user[0];
                res.render('profile', {
                    title: 'Profile',
                    logout: true,
                    infomation: infomation
                });
            } else {
                res.redirect('/auth/login');
                return;
            }
        });
    }
    async post(req, res) {
        const idUser = req.cookies.userId;
        await User.find({ id: idUser }, (err, user) => {
            if (user.length) {
                const infomation = user[0];
                Post.find({ userid: idUser})
                    .then(posts => {
                        posts = posts.map(post => post.toObject());
                        posts.sort(function(a,b){
                          return new Date(b.date) - new Date(a.date);
                        });
                        res.render('post', {
                            title: 'Post',
                            logout: true,
                            posts: posts,
                            infomation: infomation
                        });
                    });
            } else {
                res.redirect('/auth/login');
                return;
            }
        });
    }
    logout(req, res) {
        res.clearCookie("userId");
        res.redirect('/auth/login');
    }
}

module.exports = new HomeController();
