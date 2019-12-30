process.env.NODE_ENV = 'test'

const db = require('../../models')
const CartItemModel = require('../../models/cartItem.js')
const { propTest, assnTest, actionTest } = require('./lib/testTools.js')

describe('# CartItem Model', () => {
  propTest(CartItemModel, 'CartItem', ['quantity', 'CartId', 'ProductId'])
  assnTest(CartItemModel, [
    ['belongsTo', 'Product']
  ])
  actionTest(db.CartItem)
})