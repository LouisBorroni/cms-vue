const express = require('express');
const router = express.Router();
const { register, login, me, logout } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me);
router.post('/logout', logout);

module.exports = router;
