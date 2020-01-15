const db = require('../../models')
const Payment = db.Payment

const moment = require('moment')
moment.locale('zh-tw')

module.exports = {
  getPayments: async (req, res) => {
    try {
      const inputSn = +req.query.sn

      // 首次進入不需 Query
      if (!inputSn) return res.render('admin/payments')

      const payments = await Payment.findAll({ where: { OrderId: inputSn } })
      const showSn = req.query.sn
      
      // 確認是否有此筆訂單
      if (payments.length === 0) {
        const error = '找不到此訂單交易紀錄'
        return res.render('admin/payments', { error, showSn })
      }

      // SN、時間格式
      payments.forEach(payment => {
        payment.SN = ("000000000" + inputSn).slice(-10)
        payment.payDate = moment(payment.payTime).format('YYYY/MM/DD HH:mm')
      });

      res.render('admin/payments', { payments, showSn })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
}