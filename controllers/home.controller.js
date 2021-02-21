const User = require('../models/User');
const Post = require('../models/Post');

function displayPost(req, res, next) {
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
                posts: posts
            });
        })
        .catch(next);
}

class HomeController {
    async index(req, res, next) {
        const idUser = req.cookies.userId;
        await User.find({ id: idUser }, (err, user) => {
            if (user.length) {
                displayPost(req, res, next);
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
                const { _id, id, username, email, password, description, avatar } = user[0];
                const infomation = [ _id, id, username, email, password, description, avatar ];
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
                Post.find({ userid: idUser})
                    .then(posts => {
                        posts = posts.map(post => post.toObject());
                        posts.sort(function(a,b){
                          return new Date(b.date) - new Date(a.date);
                        });
                        res.render('post', {
                            title: 'Post',
                            logout: true,
                            posts: posts
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
