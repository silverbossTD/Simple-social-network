const User          = require('../models/User');
const Post          = require('../models/Post');
const Comment       = require('../models/Comment');

const imgur         = require('imgur-upload');
const path          = require('path');
const myClientID    = "368efbb07588b30";

const shortid       = require('shortid');

imgur.setClientID(myClientID);

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
        const user = await User.find({ id: idUser });

        if (user.length && !req.files) {
            const formData          = req.body;
            formData.id             = shortid.generate();
            formData.userid         = user[0].id;
            formData.username       = user[0].username;
            formData.avatar         = user[0].avatar;
            formData.date           = new Date();
            const newPost           = new Post(formData);

            newPost.save();

            res.redirect('/post');
            return;
        }

        let file = req.files.image;
        let filename = shortid.generate() + '.png';
        let uploadDir = './public/images/upload/';

        file.mv(uploadDir + filename)
        imgur.upload(uploadDir + filename, (err, respone) => {
            req.body.image          = `${respone.data.link}`;

            const formData          = req.body;
            formData.id             = shortid.generate();
            formData.userid         = user[0].id;
            formData.username       = user[0].username;
            formData.avatar         = user[0].avatar;
            formData.date           = new Date();
            const newPost           = new Post(formData);

            newPost.save();

            res.redirect('/post');
            return;
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
        await Post.updateOne( { id: id }, {content: req.body.content} )
        .then(() => {
            res.redirect('/post');
        })
        .catch(next);
    }
    async comments(req, res, next) {
        const idPost = req.params.id, idUser = req.cookies.userId;
        let post, comments, infomation;
        await User.find({ id: idUser })
        .then(user => {infomation = user[0]});

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
            userid: idUser,
            comments: comments,
            infomation: infomation
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
    async deleteComment(req, res, next) {
        const idPost        = req.params.id;
        const idComment     = req.params.commentId;
        const idUser        = req.cookies.userId;
        
        Comment.deleteOne( { id : idComment } )
        .then(() => {
            res.redirect(`/post/comments/${idPost}`);
        })
        .catch(next);
    }
}

module.exports = new PostController();
