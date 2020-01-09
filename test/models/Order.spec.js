process.env.NODE_ENV = 'test'

const db = require('../../models')
const OrderModel = require('../../models/order.js')
const { propTest, assnTest, actionTest } = require('./lib/testTools.js')

const props = [
  'UserId',
  'sn',
  'amount',
  'payMethod',
  'payStatus',
  'orderNo',
  'shipStatus',
  'receiver',
  'address',
  'phone'
]

describe('# Order Model', () => {
  propTest(OrderModel, 'Order', props)
  assnTest(OrderModel, [
    ['hasMany', 'Payment'],
    ['belongsTo', 'User'],
    ['belongsTo', 'Delivery'],
    ['belongsToMany', 'Product']
  ])
  actionTest(db.Order)
})