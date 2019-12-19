process.env.NODE_ENV = 'test'

const db = require('../../models')
const TagModel = require('../../models/tag.js')

const { propTest, assnTest, actionTest } = require('./lib/testTools.js')

describe('# Tag Model', () => {
  propTest(TagModel, 'Tag', ['name'])
  assnTest(TagModel, [['belongsToMany', 'Product']])
  actionTest(db.Tag)
})