const db = require('../models')
const Cart = db.Cart

module.exports = {
  async getCheckout1(req, res) {
    try {
      const cartId = req.session.cartId
      const cart = await Cart.findByPk(cartId, {
        include: [{
            association: 'products',
            attributes: ['id', 'name', 'price'],
            include: [{
              association: 'Images',
              where: { is_main: true }
            }],
        }]
      })

      // 確認有無選購商品
      if (!cart || !cart.products.length) {
        return res.redirect('/cart')
      } 

      // 計算商品價錢
      let subtotal = 0
      cart.products.forEach(prod => {
        prod.quantity = prod.CartItem.quantity
        prod.amount = (prod.price * prod.quantity)
        subtotal += prod.amount

        // 製作 passData
        prod.dataValues.quantity = prod.quantity
        prod.dataValues.amount = prod.amount
      })
      cart.subtotal = subtotal
      cart.dataValues.subtotal = subtotal

      req.flash('passData', cart)
      res.render('checkout_1', { css: 'checkout', cart })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async getCheckout2(req, res) {
    try {
      const cart = req.flash('passData')[0]

      // 預設運費
      cart.total = cart.subtotal + 150

      req.flash('passData', cart)
      res.render('checkout_2', { css: "checkout", cart })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async getCheckout3(req, res) {
    try {
      const cart = req.flash('passData')[0]

      req.flash('passData', cart)
      res.render('checkout_3', { css: "checkout", js: "checkout", cart })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async getCheckout4(req, res) {
    try {
      const cart = req.flash('passData')[0]

      req.flash('passData', cart)
      res.render('checkout_4', { css: 'checkout', cart })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}