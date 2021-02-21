const User = require('../models/User');

module.exports.requireAuth = async function(req, res, next) {
    if (!req.cookies.userId) {
        res.redirect('/auth/login');
        return;
    }

    next();
}
