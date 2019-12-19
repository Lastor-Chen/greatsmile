const router = require('express').Router()
const prodCtrller = require('../../controllers/admin/prodCtrller.js')

const { isAdminAuth } = require('../../middleware/auth')

// route base '/admin'
router.use('/', isAdminAuth)
router.get('/', (req, res) => res.redirect('/admin/products'))
router.get('/products', prodCtrller.getProducts)

module.exports = router
