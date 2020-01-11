const db = require('../../models')
const Payment = db.Payment


module.exports = {
  getPayments: async (req, res) => {
    try {
      const inputSn = +req.query.sn      
      let where = {}
      if (!inputSn) {
        return res.render('admin/payments') // 首次進入不需 Query
      } else {
        where.order_id = inputSn
      }

      const payment = await Payment.findOne({ where })
      if (!payment) {
        req.flash('error', '找不到此訂單交易紀錄')
        res.redirect('back')
      }

      // SN格式
      payment.SN = ("000000000" + inputSn).slice(-10)

      res.render('admin/payments', { payment, inputSn })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
}