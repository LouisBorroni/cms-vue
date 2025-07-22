const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const auth = require('../middleware/auth');

router.get('/me', auth, usersController.me);

module.exports = router;
