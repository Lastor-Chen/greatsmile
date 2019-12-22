const router = require('express').Router()
const prodCtrller = require('../controllers/prodCtrller.js')

// route base '/products'
router.get('/', prodCtrller.getProducts)
router.get('/:id', prodCtrller.getProduct)

module.exports = router