/**
 * 路由索引頁
 * 依 RESTful 風設計，再細拆成 router
 */
const { newebpayCb } = require('../controllers/orderCtrller.js')

// middleware
const { getCartItem } = require('../middleware/cart.js')
const { isAuth } = require('../middleware/auth.js')
const { getCategoryBar } = require('../middleware/category.js')
const { getTagGroup } = require('../middleware/tag.js')

const favicon = require('serve-favicon')
const path = require('path')

module.exports = app => {
  app.use(favicon(path.join('./','public', 'favicon.ico')))
  app.use('/admin', require('./admin/index.js'))
  app.post('/newebpay/callback', newebpayCb)  // 金流API callback
  
  app.use('/', getCartItem, getCategoryBar)  // 請勿更動順序
  app.use('/products', getTagGroup, require('./products.js'))

  app.use('/cart', require('./cart.js'))
  app.use('/orders', isAuth, require('./orders.js'))
  app.use('/users', require('./users.js'))

  app.get('/', (req, res) => res.render('home'))
  app.get('/search', getTagGroup, require('../controllers/prodCtrller').getProducts)
}