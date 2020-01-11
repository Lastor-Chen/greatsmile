const db = require('../models')
const { Cart, CartItem, Order, OrderItem, Delivery, Product, User } = db

const moment = require('moment')
moment.locale('zh-tw')

const { checkCheckout1 } = require('../lib/checker.js')

module.exports = {
  async setCheckout(req, res) {
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
        }],
        order: [['products', CartItem, 'id', 'DESC']]
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
      req.flash('passData')  // reset flash
      req.flash('passData', data)

      res.redirect('checkout_1')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  getCheckout(req, res) {
    try {
      const data = req.flash('passData')[0]
      console.log(data)

      // 無 passData，阻擋退回
      if (!data) return res.redirect('/cart')
      req.flash('passData', data)

      const view = req.path.slice(1)
      res.render(view, { css: 'checkout', js: 'checkout', data })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  checkout_1(req, res) {
    try {
      // 整理收件人資料
      const input = req.body
      const receiver = {
        receiver: [input.lastName, input.firstName],
        address: [input.postCode, input.area, input.zone, input.line1, input.line2],
        phone: input.phone
      }

      // 收件人資料注入 passData
      const data = { ...req.flash('passData')[0], ...receiver }
      req.flash('passData', data)
      console.log(data)

      // 檢查 input
      const error = checkCheckout1(input)
      if (error) {
        req.flash('error', error)
        return res.redirect('back')
      }

      res.redirect('checkout_2')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async checkout_2(req, res) {
    try {
      // 檢查 input
      const input = req.body
      if (!input.DeliveryId) {
        req.flash('error', '請選擇一種方式')
        return res.redirect('back')
      }

      // 整理寄送方式
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

      res.redirect('checkout_3')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  checkout_3(req, res) {
    try {
      // 整理付款方式
      const input = req.body
      if (!input.payMethod) {
        req.flash('error', '請選擇一種方式')
        return res.redirect('back')
      }

      // 付款方式注入 passData
      const data = { ...req.flash('passData')[0], ...input}
      req.flash('passData', data)
      console.log(data)

      res.redirect('checkout_4')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async postOrder(req, res) {
    try {
      // 取出 data 並 format
      const passData = req.flash('passData')[0]
      const data = { ...passData }
      data.address = data.address.join(',')
      data.receiver = data.receiver.join(',')

      // 建立 Order
      const order = await Order.create({
        ...data,
        UserId: req.user.id,
        payStatus: false,
        shipStatus: false
      })

      // 加入單號 SN
      const sn = ("000000000" + order.id).slice(-10)
      await order.update({ sn })

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

      // 清除購物車 items
      await CartItem.destroy({ where: { CartId: cart.id } })

      // 傳遞訊息給 success 頁
      passData.sn = sn
      passData.createdAt = moment(order.createdAt).format('YYYY/MM/DD HH:mm')
      req.flash('passData', passData)

      res.redirect('/orders/success')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async getSuccess(req, res) {
    try {
      const data = req.flash('passData')[0]
      if (!data) return res.redirect('/orders')

      // 付款期限三天 (臨時)
      const paymentTerms = moment(data.createdAt).add(3, 'days').format('YYYY/MM/DD') + ' 23:59:59'

      res.render('success', { css: 'success', data, paymentTerms })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
}