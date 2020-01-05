const db = require('../models')
const { Cart, CartItem, Order, OrderItem, Delivery } = db

module.exports = {
  async getCheckout(req, res) {
    try {
      // Query 資料庫
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
      if (!cart || !cart.products.length) return res.redirect('/cart')

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

      // 製作 passData
      cart.dataValues.subtotal = subtotal
      const data = { cart }
      req.flash('passData', data)

      res.redirect('checkout-1')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async getCheckout_1(req, res) {
    try {
      const data = req.flash('passData')[0]
      console.log(data)

      // 無 passData，阻擋退回
      if (!data) return res.redirect('/')

      req.flash('passData', data)
      res.render('checkout_1', { css: 'checkout', data })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async checkout_1(req, res) {
    try {
      // 整理收件人資料
      const input = req.body
      const receiver = {
        receiver: `${input.lastName} ${input.firstName}`,
        address: [input.postCode, input.area, input.zone, input.line1, input.line2],
        phone: input.phone
      }

      // 收件人資料注入 passData
      const data = { ...req.flash('passData')[0], ...receiver }
      req.flash('passData', data)
      console.log(data)

      res.redirect('checkout-2')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async getCheckout_2(req, res) {
    try {
      const data = req.flash('passData')[0]
      console.log(data)

      // 無 passData，阻擋退回
      if (!data) return res.redirect('/')

      req.flash('passData', data)
      res.render('checkout_2', { css: "checkout", js: 'checkout', data })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async checkout_2(req, res) {
    try {
      // 整理寄送方式
      const input = req.body
      input.DeliveryId = +input.DeliveryId

      const delivery = await Delivery.findByPk(input.DeliveryId)
      input.shipping = delivery.price
      input.deliveryMethod = delivery.method

      // 寄送方式注入 passData
      const data = { ...req.flash('passData')[0], ...input }

      // 計算運費
      data.amount = (data.cart.subtotal + input.shipping)
      req.flash('passData', data)
      console.log(data)

      res.redirect('checkout-3')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async getCheckout_3(req, res) {
    try {
      const data = req.flash('passData')[0]
      console.log(data)

      // 無 passData，阻擋退回
      if (!data) return res.redirect('/')

      req.flash('passData', data)
      res.render('checkout_3', { css: "checkout", js: "checkout", data })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async checkout_3(req, res) {
    try {
      // 整理付款方式
      const payMethod = req.body

      // 付款方式注入 passData
      const data = { ...req.flash('passData')[0], ...payMethod}
      req.flash('passData', data)
      console.log(data)

      res.redirect('checkout-4')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async getCheckout_4(req, res) {
    try {
      const data = req.flash('passData')[0]
      console.log(data)

      // 無 passData，阻擋退回
      if (!data) return res.redirect('/')

      req.flash('passData', data)
      res.render('checkout_4', { css: 'checkout', data })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async postOrder(req, res) {
    try {
      // 取出 data 並 format
      const data = req.flash('passData')[0]
      data.address = data.address.join(',')

      // 建立 Order
      const order = await Order.create({
        ...data,
        UserId: req.user.id,
        sn: 'ABCD',
        payStatus: false,
        shipStatus: false
      })

      // 建立 OrderItem
      const cart = data.cart
      console.log(cart.products[0])
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

      // 清除購物車 items
      await CartItem.destroy({ where: { CartId: cart.id } })

      res.redirect('/products')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}