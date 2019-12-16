/**
 * 路由索引頁
 * 依 RESTful 風設計，再細拆成 router
 */
const userCtrller = require('../controllers/userCtrller')

module.exports = (app) => {
  app.get('/', (req, res) => res.send('home page'))
  
  app.use('/products', require('./products.js'))
  app.use('/users', require('./users.js'))
  app.use('/admin', require('./admin/admin.js'))

  // user account
  app.get('/signup', userCtrller.getSignUp)
  app.post('/signup', userCtrller.signUp)
  app.get('/signin', userCtrller.getSignIn)
  app.post('/signin', userCtrller.signIn)
  app.get('/signout', userCtrller.signOut)
}