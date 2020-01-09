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
      const data = req.flash('passData')[0]
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

      // 成立訊息注入 passData
      req.flash('passData', {established: true})
      // 清除購物車 items
      await CartItem.destroy({ where: { CartId: cart.id } })

      res.redirect('/orders/success')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async getSuccess(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        include: 'Orders',
        attributes: ['id'],
        order: [['Orders', 'id', 'DESC']]
      })

      res.redirect(`/orders/success/${user.Orders[0].sn}`)

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async getSuccessOrder(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [
          { model: Order, include: [
            { model: Product, as: 'products', include: 'Images'}, Delivery]
        }],
        order: [['Orders', 'id', 'DESC']]
      })

      const data = { ...req.flash('passData')[0] }
      req.flash('passData', data)
      console.log(data)

      // 確認此筆訂單成立
      if (!data.established) return res.redirect('/cart')

      const order = user.Orders[0]
      // 只能查看此筆訂單成立頁面
      if (req.params.order_sn !== order.sn) return res.redirect('/cart')
      
      let subtotal = 0
      const orderProducts = order.products
      orderProducts.forEach(product => {
        product.mainImg = product.Images.find(img => img.isMain).url
        product.priceFormat = product.OrderItem.price.toLocaleString()
        product.subPriceFormat = (product.OrderItem.price * product.OrderItem.quantity).toLocaleString()
        subtotal += (product.OrderItem.price * product.OrderItem.quantity)
      })

      const subtotalFormat = subtotal.toLocaleString()
      const shippingFee = order.Delivery.price
      const receiver = order.receiver.split(",")
      const address = order.address.split(",")

      // 下訂時間
      const orderTime = moment(order.createdAt).format('YYYY/MM/DD HH:mm')
      // 付款期限 三天
      const paymentTerms = moment(order.createdAt).add(3, 'days').format('YYYY/MM/DD') + ' 23:59:59'

      res.render('success', { css: 'success', user, order, orderProducts, orderTime, subtotalFormat, shippingFee, receiver, address, paymentTerms })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  } 
}