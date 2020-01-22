const db = require('../../models')
const { Order, User, Product, Delivery } = db
const Op = require('sequelize').Op


module.exports = {
  getOrders: async (req, res) => {
    try {
      let query = ''
      let mode = req.query.mode ? req.query.mode : "all" 
      if (req.query.mode === 'uncancel') {
        query = {
          where: {
            [Op.not]: [
              { payStatus: { [Op.eq]: -1 } },
              { shipStatus: { [Op.eq]: -1 } }
            ]
          },
          order: [['id', 'DESC']],
          include: [
            { model: User },
            { model: Delivery },
            {
              model: Product, as: 'products',
              include: ['Gifts', 'Images']
            }
          ]
        }
      } else if (req.query.mode === 'cancel') {
        query = {
          where: {
            [Op.not]: [
              { payStatus: { [Op.not]: -1 } },
              { shipStatus: { [Op.not]: -1 } }
            ]
          },
          order: [['id', 'DESC']],
          include: [
            { model: User },
            { model: Delivery },
            {
              model: Product, as: 'products',
              include: ['Gifts', 'Images']
            }
          ]
        }
      } else {
        query = {
          order: [['id', 'DESC']],
          include: [
            { model: User },
            { model: Delivery },
            {
              model: Product, as: 'products',
              include: ['Gifts', 'Images']
            }
          ]
        }
      }

      const orders = await Order.findAll(query)

      orders.forEach(order => {
        order.createdTime = order.createdAt.toJSON().split('T')[0]
        if (order.payStatus === -1 && order.shipStatus === -1) {
          order.isCanceled = true
        } else {
          order.isCanceled = false
        }
        order.products.forEach(product => {
          product.mainImg = product.Images.find(img => img.isMain).url
          product.subPrice = product.OrderItem.quantity * product.OrderItem.price
        })
      })
      res.render('admin/orders', { css: 'orders', orders, mode })
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  putOrderInfo: async (req, res) => {
    try {
      const input = { ...req.body }

      if (input.receiver.trim() === '' || input.phone.trim() === '' || input.address.trim() === '') {

        req.flash('error', '欄位不得為空白')
        res.redirect('back')

      } else {

        const id = +req.params.orderId
        const order = await Order.findByPk(id)
        if (order.shipStatus !== false) {

          req.flash('error', '該筆訂單已無法修改寄送資訊')
          res.redirect('back')

        } else {

          await order.update(input)
          req.flash('success', '更新成功！')
          res.redirect('back')

        }
      }

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  cancelOrder: async (req, res) => {
    try {

      const id = req.params.orderId
      const order = await Order.findByPk(id)

      order.payStatus = -1
      order.shipStatus = -1

      await order.save()
      
      req.flash('success', '已取消該筆訂單')
      res.redirect('/admin/orders?mode=uncancel')
      
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  switchShipStatus: async (req, res) => {
    try {
      const orderId = +req.params.orderId
      const order = await Order.findByPk(orderId)
      order.shipStatus = !order.shipStatus
      await order.save()

      res.redirect('/admin/orders?mode=uncancel')
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
}