/**
 * 路由索引頁
 * 依 RESTful 風設計，再細拆成 router
 */
const userCtrller = require('../controllers/userCtrller')



module.exports = (app, passport) => {
  app.get('/', (req, res) => res.render('home'))

  app.use('/products', require('./products.js'))
  app.use('/cart', require('./cart.js'))
  app.use('/users', require('./users.js'))
  app.use('/admin', require('./admin/admin.js'))

  app.get('/search', require('../controllers/prodCtrller').getProducts)

  // user account
  app.get('/signup', userCtrller.getSignUp)
  app.post('/signup', userCtrller.signUp)
  app.get('/signin', userCtrller.getSignIn)
  app.post('/signin', userCtrller.signIn.bind(null, passport))
  app.get('/signout', userCtrller.signOut)
}