const express     = require('express');
const controller  = require('../controllers/home.controller');
const router      = express.Router();

router.get('/', controller.index);

router.get('/profile', controller.profile);

router.get('/post', controller.post);

router.get('/logout', controller.logout);

module.exports = router;
