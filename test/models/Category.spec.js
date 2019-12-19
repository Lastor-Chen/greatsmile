process.env.NODE_ENV = 'test'

const db = require('../../models')
const CategoryModel = require('../../models/category.js')

const { propTest, assnTest, actionTest } = require('./lib/testTools.js')

describe('# Category Model', () => {
  propTest(CategoryModel, 'Category', ['name'])
  assnTest(CategoryModel, [['hasMany', 'Product']])
  actionTest(db.Category)
})