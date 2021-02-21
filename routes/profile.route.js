const express     = require('express');
const controller  = require('../controllers/profile.controller');
const router      = express.Router();

router.post('/edit', controller.edit);

router.get('/user/:id', controller.profileUser);

module.exports = router;
