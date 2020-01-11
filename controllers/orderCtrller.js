const nodemailer = require('nodemailer');
const db = require('../models')
const { Cart, CartItem, Order, OrderItem, Delivery, Payment } = db

const moment = require('moment')
moment.locale('zh-tw')

const { checkCheckout1 } = require('../lib/checker.js')
const { aesDecrypt } = require('../lib/tools.js')
const getTradeInfo = require('../config/newebpay.js')

// 藍新金流
const HashKey = process.env.HASH_KEY
const HashIV = process.env.HASH_IV

// mailer 設定
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_KEY
  }
})

module.exports = {
  async getOrders(req, res) {
    try {
      const orders = await Order.findAll({
        where: { user_id: req.user.id },
        order: [['id', 'DESC']],
        include: {
          association: 'products',
          include: ['Gifts', 'Images']
        }
      })

      orders.forEach(order => {
        order.createdTime = order.createdAt.toJSON().split('T')[0]
        order.amountFormat = order.amount.toLocaleString()
        order.products.forEach(product => {
          product.mainImg = product.Images.find(img => img.isMain).url
          product.orderPrice = product.OrderItem.price.toLocaleString()
          product.subPrice = product.OrderItem.quantity * product.price
        })
      })

      res.render('orders', { orders, css: 'profile' })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async setCheckout(req, res) {
    try {
      // Query 資料庫
      const cartId = req.session.cartId
      const cart = await Cart.findByPk(cartId, {
        include: [{
          association: 'products',
          attributes: ['id', 'name', 'price'],
          include: [
            { association: 'Images', where: { is_main: true } },
            'Gifts'
          ],
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

      // 無 passData，阻擋退回
      if (!data) return res.redirect('/cart')
      req.flash('passData', data)

      const view = req.path.slice(1)
      res.render(view, { css: 'checkout', js: 'checkout', data, view })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  checkout_1(req, res) {
    try {
      // 檢查 input
      const input = req.body
      const error = checkCheckout1(input)
      if (error) {
        console.log(error)
        req.flash('error', error)
        return res.redirect('checkout_1')
      }

      // 整理收件人資料
      const receiver = {
        receiver: [input.lastName, input.firstName],
        address: [input.postCode, input.area, input.zone, input.line1, input.line2],
        phone: input.phone
      }

      // 收件人資料注入 passData
      const data = { ...req.flash('passData')[0], ...receiver }
      req.flash('passData', data)

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
        return res.redirect('checkout_2')
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
        return res.redirect('checkout_3')
      }

      // 付款方式注入 passData
      const data = { ...req.flash('passData')[0], ...input}
      req.flash('passData', data)

      res.redirect('checkout_4')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async postOrder(req, res) {
    try {
      const passData = req.flash('passData')[0]
      if (!passData) {
        req.flash('error', '錯誤訪問')
        return res.redirect('/cart')
      }

      // 取出 data 並 format
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

      // send Email
      const mailOptions = {
        from: `大微笑商店 <${process.env.GMAIL_USER}>`,
        to: req.user.email,
        subject: `【GreatSmile Online Shop】訂單已建立 (單號${sn})`,
        text: `${sn} 訂單已成立`
      }

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) return console.error(err)
        console.log(`Email sent: ${info.response}`)
      })
      
      // 傳遞資料給 success 頁
      passData.sn = sn
      passData.createdAt = order.createdAt
      req.flash('passData', passData)
      req.flash('isCreated', true)

      res.redirect('/orders/success')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async getSuccess(req, res) {
    try {
      // 阻擋非經由 postOrder 進入的請求
      const isCreated = req.flash('isCreated')[0]
      if (!isCreated) return res.redirect('/orders')

      // 取出、整理購物 data
      const data = req.flash('passData')[0]
      const orderDate = moment(data.createdAt).format('YYYY/MM/DD HH:mm')

      // 付款期限三天 (臨時)
      const paymentTerms = moment(data.createdAt).add(3, 'days').format('YYYY/MM/DD') + ' 23:59:59'

      res.render('success', { css: 'success', data, orderDate, paymentTerms })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async getPayment(req, res) {
    try {
      // 查詢訂單
      const order = await Order.findOne({
        where: { 
          id: +req.params.id,
          UserId: req.user.id,
          pay_status: false,
        },
        include: [{ 
          association: 'products',
          attributes: ['name'] 
        }]
      })

      if (!order) return res.redirect('/orders')

      // 製作串金流資料
      const prodNames = order.products.map(prod => prod.name).join(', ')
      const tradeInfo = getTradeInfo(order.amount, prodNames, req.user.email)

      // 儲存識別用 orderNo
      await order.update({ orderNo: tradeInfo.MerchantOrderNo })

      res.render('payment', { tradeInfo, layout: false })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async newebpayCb(req, res) {
    try {
      if (!req.body.TradeInfo) return res.redirect('/orders')

      // 解密、整理資料
      const tradeInfo = JSON.parse(aesDecrypt(req.body.TradeInfo, HashKey, HashIV))
      console.log(tradeInfo)

      // 防止不同用戶 "同時" 進行支付，此時不對資料庫操作
      if (tradeInfo.Message === '已存在相同的商店訂單編號') return res.redirect('/orders')

      const orderNo = tradeInfo.Result.MerchantOrderNo
      let payTime = tradeInfo.Result.PayTime
      payTime = payTime.slice(0, 10) + 'T' + payTime.slice(10)

      // 更新資料庫
      const order = await Order.findOne({ where: { orderNo } })

      // 藍新會戳路由4次，防止重複建立
      await Payment.findOrCreate({
        where: { orderNo: tradeInfo.Result.MerchantOrderNo },
        defaults: {
          OrderId: order.id,
          status: tradeInfo.Status === 'SUCCESS' ? true : false,
          code: tradeInfo.Status,
          msg: tradeInfo.Message,
          tradeNo: tradeInfo.Result.TradeNo,
          payTime: payTime
        }
      })

      if (tradeInfo.Status === 'SUCCESS') {
        await order.update({ payStatus: true })
      }

      res.redirect('/orders')
      
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
}