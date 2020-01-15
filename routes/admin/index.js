const router = require('express').Router()
const { isAdminAuth } = require('../../middleware/auth')
const prodCtrller = require('../../controllers/admin/prodCtrller')

// 判斷 admin 權限，set admin layout
router.use('/', isAdminAuth, (req, res, next) => {
  res.locals.layout = 'admin'
  res.locals.path = req.path
  next()
})

// route base '/admin'
router.get('/', (req, res) => res.redirect('/admin/products'))
router.delete('/images/:id', prodCtrller.deleteImage)

router.use('/products', require('./products.js'))
router.use('/users', require('./users.js'))
router.use('/orders', require('./orders.js'))
router.use('/tags', require('./tags.js'))

router.use('/categories', require('./categories.js'))
router.use('/series', require('./series.js'))
router.use('/payments', require('./payments.js'))

module.exports = router
