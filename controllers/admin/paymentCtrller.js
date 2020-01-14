const db = require('../../models')
const Payment = db.Payment

const moment = require('moment')
moment.locale('zh-tw')

module.exports = {
  getPayments: async (req, res) => {
    try {
      let inputSn = +req.query.sn      
      let where = {}
      if (!inputSn) {
        return res.render('admin/payments') // 首次進入不需 Query
      } else {
        where.order_id = inputSn
      }

      const payments = await Payment.findAll({ where })
      if (!payments) {
        req.flash('error', '找不到此訂單交易紀錄')
        return res.redirect('/admin/payments')
      }

      // SN、時間格式
      payments.forEach(payment => {
        payment.SN = ("000000000" + inputSn).slice(-10)
        payment.payDate = moment(payment.payTime).format('YYYY/MM/DD HH:mm')
      });
      showSn = ("000000000" + inputSn).slice(-10)
      res.render('admin/payments', { payments, showSn })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
}