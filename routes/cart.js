const router = require('express').Router()
const cartCtrller = require('../controllers/cartCtrller.js')

// route base '/cart'
router.get('/', cartCtrller.getCart)
router.post('/', cartCtrller.postCart)
router.put('/cartItem/:id/update', cartCtrller.updateCartItem)
router.delete('/cartItem/:id/delete', cartCtrller.deleteCartItem)
module.exports = router