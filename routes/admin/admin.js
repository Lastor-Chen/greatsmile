const router = require('express').Router()
const prodCtrller = require('../../controllers/admin/prodCtrller.js')

// route base '/admin'
router.get('/', (req, res) => res.redirect('/admin/products'))
router.get('/products', prodCtrller.getProducts)

module.exports = router
