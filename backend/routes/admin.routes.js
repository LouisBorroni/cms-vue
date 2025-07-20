const express = require('express');
const router = express.Router();
const checkAdmin = require('../middleware/checkAdmin');
const adminController = require('../controllers/admin.controller');

router.use(checkAdmin);

router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
