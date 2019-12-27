/**
 * 路由索引頁
 * 依 RESTful 風設計，再細拆成 router
 */
const { getCartItem } = require('../middleware/cart.js')

module.exports = app => {
  app.use('/admin', require('./admin/admin.js'))

  app.use('/products', getCartItem, require('./products.js'))
  app.use('/cart', require('./cart.js'))
  app.use('/users', getCartItem, require('./users.js'))
  
  app.get('/', (req, res) => res.render('home'))
  app.get('/search', require('../controllers/prodCtrller').getProducts)
}