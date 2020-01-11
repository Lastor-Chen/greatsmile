const db = require('../../models')
const { Payment } = db


module.exports = {
  getpayments: async (req, res) => {
    try {
      
      res.render('admin/payments')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
}