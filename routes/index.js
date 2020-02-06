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

const db = require('../models')
const Op = db.Sequelize.Op
const { Product } = db
const { checkInv, txnOrder } = require('../lib/order_helper.js')

module.exports = app => {
  app.use('/admin', require('./admin/index.js'))
  app.post('/newebpay/callback', newebpayCb)  // 金流API callback
  
  app.use('/', getCartItem, getCategoryBar)  // 請勿更動順序
  app.use('/products', getTagGroup, require('./products.js'))

  app.use('/cart', require('./cart.js'))
  app.use('/orders', isAuth, require('./orders.js'))
  app.use('/users', require('./users.js'))

  app.get('/', (req, res) => res.redirect('/products'))
  app.get('/search', getTagGroup, require('../controllers/prodCtrller').getProducts)

  app.get('/test', async (req, res) => {
    const cartProds = [
      { id: 1, CartItem: { quantity: 1 }},
      // { id: 2, CartItem: { quantity: 1 }},
      { id: 3, CartItem: { quantity: 1 }},
    ]
    const queryArray = cartProds.map(prod => ({ id: prod.id }))

    try {
      // 檢查商品庫存
      const products = await Product.findAll(
        { where: { [Op.or]: queryArray } }
      )

      const error = checkInv(products, cartProds)
      if (error) {
        req.flash('error', error)
        return res.redirect('/cart')
      }
      
      // 成立訂單 by transaction
      const txnError = await txnOrder()
      if (txnError) { throw txnError }

      res.send('fin')
    } catch (error) {
      console.log(error.toString())
      res.send('error')
    }
  })
}

