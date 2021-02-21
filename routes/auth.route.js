const express     = require('express');
const controller  = require('../controllers/auth.controller');
const router      = express.Router();

router.get('/login', controller.login);

router.get('/register', controller.register);

router.post('/login', controller.signin);

router.post('/register', controller.signup);


module.exports = router;
