const express     = require('express');
const controller  = require('../controllers/post.controller');
const router      = express.Router();

router.post('/create', controller.create);

router.get('/delete/:id', controller.delete);

router.get('/edit/:id', controller.edit);

router.post('/edit/:id', controller.editPost);

module.exports = router;
