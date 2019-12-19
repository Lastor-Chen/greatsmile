process.env.NODE_ENV = 'test'

const db = require('../../models')
const TagItemModel = require('../../models/tagItem.js')

const { propTest, assnTest, actionTest } = require('./lib/testTools.js')

describe('# TagItem Model', () => {
  propTest(TagItemModel, 'TagItem', ['TagId', 'ProductId'])
  actionTest(db.TagItem)
})