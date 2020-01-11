/**
 * 路由索引頁
 * 依 RESTful 風設計，再細拆成 router
 */
const { getCartItem } = require('../middleware/cart.js')
const { isAuth } = require('../middleware/auth.js')
const { newebpayCb } = require('../controllers/orderCtrller.js')

module.exports = app => {
  app.use('/admin', require('./admin/index.js'))
  app.post('/newebpay/callback', newebpayCb)  // 金流API callback
  
  app.use('/', getCartItem)  // 請勿更動順序
  app.use('/products', require('./products.js'))
  app.use('/cart', require('./cart.js'))
  app.use('/orders', isAuth, require('./orders.js'))
  app.use('/users', require('./users.js'))

  app.get('/', (req, res) => res.render('home'))
  app.get('/search', require('../controllers/prodCtrller').getProducts)
}