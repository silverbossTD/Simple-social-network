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
        });

        success.push('The post has been successfully posted');
        res.render('post', {
            title: "Post",
            errors: errors,
            success: success
        });
    }
}

module.exports = new PostController();
