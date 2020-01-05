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
      console.log(cart.dataValues)
      req.flash('passData', { cart })
      res.render('checkout_1', { css: 'checkout', cart })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async checkout2(req, res) {
    try {
      // 整理收件人資料
      const input = req.body
      const receiver = {
        receiver: `${input.lastName} ${input.firstName}`,
        address: `${input.postCode},${input.area},${input.zone},${input.line1},${input.line2}`,
        phone: input.phone
      }
      
      // 收件人資料注入 passData
      const data = { ...req.flash('passData')[0], ...receiver }
      req.flash('passData', data)
      console.log(data)

      const cart = data.cart

      res.render('checkout_2', { css: "checkout", js: 'checkout', cart })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async checkout3(req, res) {
    try {
      // 整理寄送方式
      const deliveryMethod = req.body

      // 寄送方式注入 passData
      const data = { ...req.flash('passData')[0], ...deliveryMethod }
      req.flash('passData', data)
      console.log(data)

      const cart = data.cart
      
      res.render('checkout_3', { css: "checkout", js: "checkout", cart })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async checkout4(req, res) {
    try {
      // 整理付款方式
      const payMethod = req.body

      // 付款方式注入 passData
      const data = { ...req.flash('passData')[0], ...payMethod}
      req.flash('passData', data)
      console.log(data)

      const cart = data.cart
      
      res.render('checkout_4', { css: 'checkout', cart })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async postOrder(req, res) {
    try {
      const data = req.flash('passData')[0]

      // 建立 Order
      const order = await Order.create({
        ...data,
        UserId: req.user.id,
        sn: 'ABCD',
        amount: data.cart.total,
        payStatus: false,
        shipStatus: false
      })

      // 建立 OrderItem
      const cart = data.cart
      await Promise.all(
        cart.products.map(prod =>
          OrderItem.create({
            price: prod.price,
            quantity: prod.quantity,
            OrderId: order.id,
            product_id: prod.id
          })
        )
      )

      res.redirect('/products')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}