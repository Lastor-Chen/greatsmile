const router = require('express').Router()
const orderCtrller = require('../controllers/orderCtrller.js')

// route base '/orders'
router.get('/checkout-1', orderCtrller.getCheckout1)
router.get('/checkout-2', orderCtrller.getCheckout2)
router.get('/checkout-3', orderCtrller.getCheckout3)
router.get('/checkout-4', orderCtrller.getCheckout4)

module.exports = router