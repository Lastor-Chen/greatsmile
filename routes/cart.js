const router = require('express').Router()
const cartCtrller = require('../controllers/cartCtrller.js')

// route base '/cart'
router.get('/', cartCtrller.getCart)
router.post('/', cartCtrller.postCart)
router.post('/cartItem/:id/add', cartCtrller.addCartItem)
router.post('/cartItem/:id/sub', cartCtrller.subCartItem)
router.post('/cartItem/:id/update', cartCtrller.updateCartItem)
router.post('/cartItem/:id/delete', cartCtrller.deleteCartItem)
module.exports = router