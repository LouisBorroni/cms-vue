const express = require('express')
const router = express.Router()
const ordersController = require('../controllers/orders.controller')

router.post('/', ordersController.createOrder)
router.get('/', ordersController.getOrdersByUser)

module.exports = router
