const db = require('../models')
const Cart = db.Cart
const Order = db.Order
const OrderItem = db.OrderItem

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

      req.flash('passData', { cart })
      res.render('checkout_1', { css: 'checkout', cart })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async checkout2(req, res) {
    try {
      console.log(req.body)
      const address = req.body

      const data = req.flash('passData')[0]
      console.log(data)

      const cart = data.cart
      data.address = address

      // 預設運費
      cart.total = cart.subtotal + 150
      data.cart = cart

      req.flash('passData', data)
      res.render('checkout_2', { css: "checkout", cart })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async checkout3(req, res) {
    try {
      console.log(req.body)

      const { deliveryMethod } = req.body
      const data = req.flash('passData')[0]
      console.log(data)

      const cart = data.cart
      data.deliveryMethod = deliveryMethod

      req.flash('passData', data)
      res.render('checkout_3', { css: "checkout", js: "checkout", cart })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async checkout4(req, res) {
    try {
      console.log(req.body)

      const { payMethod } = req.body
      const data = req.flash('passData')[0]
      console.log(data)

      const cart = data.cart
      data.payMethod = payMethod

      req.flash('passData', data)
      res.render('checkout_4', { css: 'checkout', cart })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async postOrder(req, res) {
    try {
      console.log(req.body)

      const data = req.flash('passData')[0]
      console.log(data)
      
      const { cart, address, deliveryMethod, payMethod } = data
 
      const order = await Order.create({
        UserId: 1,
        sn: 'ABCDE',
        receiver: address.firstName + address.lastName,
        phone: address.phone,
        address: address.line1,
        amount: data.cart.total,
        payMethod: payMethod,
        deliveryMethod: deliveryMethod,
      })

      // OrderItems
      await Promise.all(
        cart.products.map(prod => {
          OrderItem.create({
            price: prod.price,
            quantity: prod.quantity,
            OrderId: order.id,
            product_id: prod.id
          })
        })
      )

      res.redirect('/products')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}