const router = require('express').Router()
const cartCtrller = require('../controllers/cartCtrller.js')

// route base '/products'
router.post('/', cartCtrller.postCart)

module.exports = router