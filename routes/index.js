/**
 * 路由索引頁
 * 依 RESTful 風設計，再細拆成 router
 */
const { cartItemSum } = require('../middleware/cart.js')

module.exports = app => {
  app.use('/admin', require('./admin/admin.js'))

  app.use('/', cartItemSum)
  app.use('/products', require('./products.js'))
  app.use('/cart', require('./cart.js'))
  app.use('/users', require('./users.js'))
  
  app.get('/', (req, res) => res.render('home'))
  app.get('/search', require('../controllers/prodCtrller').getProducts)
}