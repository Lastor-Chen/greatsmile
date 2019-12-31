const db = require('../../models')
const { Order, User, Product } = db


module.exports = {
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({
        order: [['id', 'DESC']],
        include: [
          { model: User },
          {
            model: Product, as: 'products',
            include: ['Gifts', 'Images']
          }
        ]
      })

      orders.forEach(order => {
        order.createdTime = order.createdAt.toJSON().split('T')[0]
        order.products.forEach(product => {
          product.mainImg = product.Images.find(img => img.isMain).url
          product.subPrice = product.OrderItem.quantity * product.price
        })
      })
      console.log(orders[0])
      res.render('admin/orders', { orders })
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
}