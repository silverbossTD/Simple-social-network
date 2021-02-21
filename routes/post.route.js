const express     = require('express');
const controller  = require('../controllers/post.controller');
const router      = express.Router();

router.post('/create', controller.create);

module.exports = router;
