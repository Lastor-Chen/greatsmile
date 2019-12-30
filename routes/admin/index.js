const router = require('express').Router()
const { isAdminAuth } = require('../../middleware/auth')

// 判斷 admin 權限，set admin layout
router.use('/', isAdminAuth, (req, res, next) => {
  res.locals.layout = 'admin'
  res.locals.path = req.path
  next()
})

// route base '/admin'
router.get('/', (req, res) => res.redirect('/admin/products'))

router.use('/products', require('./products.js'))
router.use('/users', require('./users.js'))
router.use('/orders', require('./orders.js'))

module.exports = router
