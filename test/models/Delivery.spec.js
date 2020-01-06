process.env.NODE_ENV = 'test'

const db = require('../../models')
const DeliveryModel = require('../../models/delivery.js')

const { propTest, assnTest, actionTest } = require('./lib/testTools.js')

describe('# Delivery Model', () => {
  propTest(DeliveryModel, 'Delivery', ['method', 'price'])
  assnTest(DeliveryModel, [['hasMany', 'Order']])
  actionTest(db.Delivery)
})