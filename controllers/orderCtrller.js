const db = require('../models')
const { Cart, CartItem, Order, OrderItem, Delivery, Payment, Product } = db

const Op = require('sequelize').Op
const moment = require('moment')
moment.locale('zh-tw')

const { checkCheckout1 } = require('../lib/checker.js')
const { aesDecrypt } = require('../lib/tools.js')

// 藍新金流
const getTradeInfo = require('../config/newebpay.js')
const HashKey = process.env.HASH_KEY
const HashIV = process.env.HASH_IV

// nodemailer
const { transporter, getMailObj } = require('../config/mailer.js')

module.exports = {
  async getOrders(req, res) {
    try {
      const orders = await Order.findAll({
        where: { user_id: req.user.id },
        order: [['id', 'DESC']],
        include: [{
          association: 'products',
          include: ['Gifts', 'Images']
        }, 
        'Delivery']
      })

      orders.forEach(order => {
        order.createdTime = order.createdAt.toJSON().split('T')[0]
        order.sumPrice = order.amount - order.Delivery.price
        order.products.forEach(product => {
          product.mainImg = product.Images.find(img => img.isMain).url
          product.subPrice = product.OrderItem.quantity * product.OrderItem.price
        })
        order.orderAddress = order.address.split(',')
      })
      res.render('orders', { orders, css: 'orders' })

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

      // 建立已通過 flag
      req.flash('passedSteps', [0])

      res.redirect('checkout_1')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async getCheckout(req, res) {
    try {
      const data = req.flash('passData')[0]
      const beforePath = req.flash('beforePath')
      
      // 無 passData，阻擋退回
      if (!data) return res.redirect('/cart')
      req.flash('passData', data)

      // 審核是否有經過 POST 表單
      const passedSteps = req.flash('passedSteps')
      req.flash('passedSteps', passedSteps)

      const beforeStep = (+req.path.slice(-1)) - 1
      const isPassed = passedSteps.includes(beforeStep)
      if (!isPassed) return res.redirect('/orders' + beforePath)

      req.flash('beforePath', [req.path])

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

      // 建立已通過 flag
      req.flash('passedSteps', 1)

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

      // 建立已通過 flag
      req.flash('passedSteps', 2)

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

      // 建立已通過 flag
      req.flash('passedSteps', 3)

      res.redirect('checkout_4')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async postOrder(req, res) {
    try {
      // 確認攜帶 passData
      const passData = req.flash('passData')[0]
      if (!passData) {
        req.flash('error', '錯誤訪問')
        return res.redirect('/cart')
      }

      // 確認已通過各表單 passedSteps
      const passedSteps = req.flash('passedSteps')
      const isPassed = [0, 1, 2, 3].every(step => passedSteps.includes(step))
      if (!isPassed) {
        req.flash('error', '錯誤訪問')
        return res.redirect('/cart')
      }

      // 取出 data 並 format
      const data = { ...passData }
      data.address = data.address.join(',')
      data.receiver = data.receiver.join(' ')

      // 計算商品庫存
      const cartProds = data.cart.products
      const queryArray = cartProds.map(prod => ({ id: prod.id }))
      const products = await Product.findAll({ where: {
        [Op.or]: queryArray
      }})

      // 遍歷商品，確認庫存狀況
      const noInvProds = []
      const hasInvProds = []
      products.forEach(async prod => {
        const cartProd = cartProds.find(item => item.id === prod.id)
        const inventory = (prod.inventory - cartProd.CartItem.quantity)
        if (inventory < 0) return noInvProds.push({ name: prod.name, qty: prod.inventory })

        prod.inventory = inventory
        hasInvProds.push(prod)
      })

      // 併發無庫存時，停止訂單建立
      if (noInvProds.length) {
        let msg = ''
        noInvProds.forEach(prod => {
          msg += `商品 ${prod.name}，庫存數量為 ${prod.qty}，已超出您選購的數量\n`
        })
        req.flash('error', msg)
        return res.redirect('/cart')
      }

      // 確認都有庫存，才 update
      hasInvProds.forEach(async prod => await prod.save())

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
      const mail = getMailObj(data, req.user, order, sn)
      transporter.sendMail(mail, (err, info) => {
        if (err) return console.error(err)
        console.log(`Email sent: ${info.response}`)
      })
      
      // 傳遞資料給 success 頁
      passData.id = order.id
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
      const twDate = moment(data.createdAt).tz('Asia/Taipei')
      const orderDate = twDate.format('YYYY/MM/DD HH:mm')

      // 付款期限三天 (臨時)
      const paymentTerms = twDate.add(3, 'days').format('YYYY/MM/DD')

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

      // 防止不同用戶 "同時" 進行支付，此時不對資料庫操作
      if (tradeInfo.Message === '已存在相同的商店訂單編號') return res.redirect('/orders')

      const orderNo = tradeInfo.Result.MerchantOrderNo
      let payTime = tradeInfo.Result.PayTime
      payTime = payTime.slice(0, 10) + 'T' + payTime.slice(10) + '+08:00'

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