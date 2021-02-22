const express     = require('express');
const controller  = require('../controllers/profile.controller');
const router      = express.Router();

router.post('/edit', controller.edit);

router.post('/updateAvatar', controller.updateAvatar);

router.get('/user/:id', controller.profileUser);

module.exports = router;
