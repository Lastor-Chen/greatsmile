process.env.NODE_ENV = 'test'

const db = require('../../models')
const CartModel = require('../../models/cart.js')
const { propTest, assnTest, actionTest } = require('./lib/testTools.js')

describe('# Cart Model', () => {
  assnTest(CartModel, [
    ['belongsToMany', 'Product']
  ])
  actionTest(db.Cart)
})