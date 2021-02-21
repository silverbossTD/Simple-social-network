const Post      = require('../models/Post');
const User      = require('../models/User');
const shortid   = require('shortid');

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
}

module.exports = new PostController();
