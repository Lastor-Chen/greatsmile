const router = require('express').Router()
const prodCtrller = require('../../controllers/admin/prodCtrller.js')


// route base '/admin/products'
router.get('/', prodCtrller.getProducts)
router.get('/new', prodCtrller.getAddPage)

module.exports = router
