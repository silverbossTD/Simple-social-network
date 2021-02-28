const User          = require('../models/User');
const bcrypt        = require('bcrypt');
const shortid       = require('shortid');

class AuthController {
    login(req, res) {
        res.render('auth/login', {
            title: 'Login'
        });
    }
    register(req, res) {
        res.render('auth/register', {
            title: 'Register'
        });
    }
    async signin(req, res) {
        let errors = [];

    	if(!req.body.email || !req.body.password) {
    		errors.push("Wrong email or password");
    	}

        const user = await User.find({ email: req.body.email });

        if (user.length) {
            const validPassword = await bcrypt.compare(req.body.password, user[0].password);
            if (validPassword) {
                res.cookie('userId', user[0].id.toString());
            } else {
                errors.push("Wrong email or password");
            }
        } else {
            errors.push("Wrong email or password");
        }

        if(errors.length) {
    		res.render('auth/login', {
    			title: "Login",
    			errors: errors,
    		});
    		return;
    	}
        res.redirect('/');
    }
    async signup(req, res) {
    	let errors = [];

        if(!req.body.username) {
    		errors.push("Username is required.");
    	}

    	if(!req.body.email) {
    		errors.push("Email is required.");
    	}

    	if(!req.body.password) {
    		errors.push("Password is required");
    	}

        if(req.body.password != req.body.passwordConf) {
    		errors.push("Password confirmation is incorrect");
    	}

        await User.find({ "username": req.body.username}, (err, user) => {
            if (user.length) {
                errors.push("Username is already in use");
            }
        });
        await User.find({ "email": req.body.email}, (err, user) => {
            if (user.length) {
                errors.push("Email is already in use");
            }
        });

    	if(errors.length) {
    		res.render('auth/register', {
    			title: "Register",
    			errors: errors,
    		});
    		return;
    	}
        /* Hash password */

        const salt              = await bcrypt.genSalt();
        req.body.password       = await bcrypt.hash(req.body.password, salt);

        /* Create new account */
        const formData          = req.body;
        formData.id             = shortid.generate();
        formData.description    = "";
        formData.date           = new Date();
        const newUser           = new User(formData);

        newUser.save();

        res.redirect('/auth/login');
    }
}

module.exports =  new AuthController();
