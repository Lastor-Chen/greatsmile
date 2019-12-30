process.env.NODE_ENV = 'test'

const db = require('../../models')
const OrderItemModel = require('../../models/orderItem.js')
const { propTest, assnTest, actionTest } = require('./lib/testTools.js')

describe('# OrderItem Model', () => {
  propTest(OrderItemModel, 'OrderItem', ['price', 'quantity', 'OrderId', 'ProductId'])
  actionTest(db.OrderItem)
})