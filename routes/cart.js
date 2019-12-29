const router = require('express').Router()
const cartCtrller = require('../controllers/cartCtrller.js')

// route base '/cart'
router.get('/', cartCtrller.getCart)
router.post('/', cartCtrller.postCart)
router.post('/cartItem/:id/add', cartCtrller.postCartItemAdd)
module.exports = router