const router = require('express').Router()
const orderCtrller = require('../controllers/orderCtrller.js')

// route base '/orders'
router.get('/checkout-1', orderCtrller.getCheckout1)
router.post('/checkout-2', orderCtrller.checkout2)
router.post('/checkout-3', orderCtrller.checkout3)
router.post('/checkout-4', orderCtrller.checkout4)
router.post('/', orderCtrller.postOrder)

module.exports = router