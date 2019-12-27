const router = require('express').Router()
const prodCtrller = require('../controllers/prodCtrller.js')

const { cartItemSum } = require('../middleware/cart.js')

router.use('/', cartItemSum)

// route base '/products'
router.get('/', prodCtrller.getProducts)
router.get('/:id', prodCtrller.getProduct)

module.exports = router