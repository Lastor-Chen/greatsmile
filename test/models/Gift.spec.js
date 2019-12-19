process.env.NODE_ENV = 'test'

const db = require('../../models')
const GiftModel = require('../../models/gift.js')

const { propTest, assnTest, actionTest } = require('./lib/testTools.js')

describe('# Gift Model', () => {
  propTest(GiftModel, 'Gift', ['name', 'image', 'ProductId'])
  assnTest(GiftModel, [['belongsTo', 'Product']])
  actionTest(db.Gift)
})