const db = require('../../models')
const { Order, User } = db


module.exports = {
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({
        order: [['id', 'DESC']],
        include: [User]
      })

      orders.forEach(order => {
        order.createdTime = order.createdAt.toJSON().split('T')[0]
      })

      console.log(orders[0])
      res.render('admin/orders', { orders })
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
}