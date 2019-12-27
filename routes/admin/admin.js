const router = require('express').Router()
const prodCtrller = require('../../controllers/admin/prodCtrller.js')
const userCtrller = require('../../controllers/admin/userCtrller')

const { isAdminAuth } = require('../../middleware/auth')

// 判斷 admin 權限，set admin layout
router.use('/', isAdminAuth, (req, res, next) => {
  res.locals.layout = 'admin'
  next()
})

// route base '/admin'
router.get('/', (req, res) => res.redirect('/admin/products'))
router.get('/products', prodCtrller.getProducts)
router.get('/products/new', prodCtrller.getAddPage)

router.get('/users', userCtrller.getUsers)

module.exports = router
