const db = require('../../models')
const { Order } = db


module.exports = {
  getOrders: (req, res) => {
    res.send('order page')
  },
}