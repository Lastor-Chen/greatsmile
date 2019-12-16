const router = require('express').Router()
const prodCtrller = require('../controllers/prodCtrller.js')

// route base '/products'
router.get('/', prodCtrller.getProducts)

module.exports = router