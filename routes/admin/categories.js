const router = require('express').Router()
const categoryCtrller = require('../../controllers/admin/categoryCtrller')

// route base '/admin/categories'
router.get('/', categoryCtrller.getCategories)

module.exports = router