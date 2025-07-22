const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');
const auth = require('../middleware/auth'); 

router.post('/', auth, ordersController.createOrder);
router.get('/', auth, ordersController.getOrdersByUser);

module.exports = router;
