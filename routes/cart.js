const router = require('express').Router()
const cartCtrller = require('../controllers/cartCtrller.js')

// route base '/cart'
router.get('/', cartCtrller.getCart)
router.post('/', cartCtrller.postCart)

module.exports = router