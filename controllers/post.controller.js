const Post         = require('../models/Post');
const User         = require('../models/User');
const Comment      = require('../models/Comment');

const shortid      = require('shortid');

class PostController {
    async create(req, res, next) {
        let errors = [], success = [];

        if (!req.body.content) {
            errors.push('Please write the content');
        }

        if(errors.length) {
    		res.render('post', {
    			title: "Post",
    			errors: errors,
                success: success
    		});
    		return;
    	}

        const idUser = req.cookies.userId;
        await User.find({ id: idUser }, (err, user) => {
            if (user.length) {
                const formData          = req.body;
                formData.id             = shortid.generate();
                formData.userid         = user[0].id;
                formData.username       = user[0].username;
                formData.avatar         = user[0].avatar;
                formData.date           = new Date();
                const newPost           = new Post(formData);

                newPost.save();
            }
        })
        .then(() => {
            res.redirect('/post');
        });
    }
    async delete(req, res, next) {
        const id = req.params.id;
        Post.deleteOne( { id : id } )
        .then(() => Comment.remove({ post: id }))
        .then(() => {
            res.redirect('/post');
        })
        .catch(next);
    }
    async edit(req, res, next) {
        const id = req.params.id;
        await Post.find({ id: id }, req.body)
        .then((post) => {
            const content = post[0].content;
            res.render('post', {
                title: 'Edit post',
                logout: true,
                content: content
            });
        });
    }
    async editPost(req, res, next) {
        const id = req.params.id;
        await Post.updateOne( { id: id }, req.body.content )
        .then(() => {
            res.redirect('/post');
        })
        .catch(next);
    }
    async comments(req, res, next) {
        const idPost = req.params.id;
        let post, comments;
        await Post.find({ id: idPost })
        .then(data => post = data[0]);
        await Comment.find({ post: idPost })
        .then(data => {
                comments = data.sort(function(a,b){
                return new Date(b.date) - new Date(a.date);
            });
        });
        res.render('comments', {
            title: 'Comments',
            post: post,
            logout: true,
            comments: comments
        });
    }
    async postComment(req, res, next) {
        const idPost = req.params.id;
        const idUser = req.cookies.userId;

        await Post.find({ id: idPost })
        .then(post => {
            post = post[0];
            User.find({ id: idUser })
            .then(user => {
                user = user[0];
                const newComment = new Comment({
                    post: idPost,
                    id: shortid.generate(),
                    userid: user.id,
                    username: user.username,
                    avatar: user.avatar,
                    content: req.body.content,
                    date: new Date()
                });
                newComment.save().then((completed) => {
                    res.redirect(`/post/comments/${idPost}`);
                });
            });
        });
    }
}

module.exports = new PostController();
