const express     = require('express');
const controller  = require('../controllers/post.controller');
const router      = express.Router();

router.post('/create', controller.create);

router.get('/delete/:id', controller.delete);

router.get('/edit/:id', controller.edit);

router.post('/edit/:id', controller.editPost);

router.get('/comments/:id', controller.comments);

router.post('/comments/:id', controller.postComment);

module.exports = router;
