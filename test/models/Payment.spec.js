process.env.NODE_ENV = 'test'

const db = require('../../models')
const PaymentModel = require('../../models/payment.js')
const { propTest, assnTest, actionTest } = require('./lib/testTools.js')

const props = [
  'OrderId',
  'status',
  'code',
  'msg',
  'tradeNo',
  'orderNo',
  'payTime'
]

describe('# Payment Model', () => {
  propTest(PaymentModel, 'Payment', props)
  assnTest(PaymentModel, [
    ['belongsTo', 'Order'],
  ])
  actionTest(db.Payment)
})