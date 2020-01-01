const db = require('../models')
const Cart = db.Cart

module.exports = {
  async addressPage(req, res) {
    try {
      const cartId = req.session.cartId
      const cart = await Cart.findByPk(cartId, {
        include: [
          { 
            association: 'products',
            attributes: ['id', 'name', 'price'],
            include: [{
              association: 'Images',
              where: { is_main: true }
            }],
          }
        ]
      })

      // 確認有無選購商品
      if (!cart || !cart.products.length) {
        return res.redirect('/cart')
      } 

      // 製作頁面資料
      const products = cart.products
      let totalPrice = 0
      products.forEach(prod => {
        prod.quantity = prod.CartItem.quantity
        prod.amount = (prod.price * prod.quantity)
        totalPrice += prod.amount
      })

      res.render('address', { css: 'address', cart, totalPrice })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async address(req, res) {
    try {

      res.redirect('/order/delivery-method')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async deliveryPage(req, res) {
    try {

      res.render('delivery', { css: "delivery" })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
}