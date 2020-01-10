const router = require('express').Router()
const categoryCtrller = require('../../controllers/admin/categoryCtrller')

// route base '/admin/categories'
router.get('/', categoryCtrller.getCategories)
router.post('/', categoryCtrller.postCategories)
router.put('/:categoriesid', categoryCtrller.putCategory)
router.delete('/:categoriesid', categoryCtrller.deleteCategory)

module.exports = router