/**
 * 路由索引頁
 * 依 RESTful 風設計，再細拆成 router
 */
const { getCartItem } = require('../middleware/cart.js')

module.exports = app => {
  app.use('/admin', require('./admin/index.js'))
  app.use('/cart', require('./cart.js'))

  app.use('/', getCartItem)  // 請勿更動順序
  app.use('/products', require('./products.js'))
  app.use('/users', require('./users.js'))

  app.use('/admin', require('./admin/index.js'))

  app.get('/search', require('../controllers/prodCtrller').getProducts)
}