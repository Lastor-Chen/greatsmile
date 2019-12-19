process.env.NODE_ENV = 'test'

const db = require('../../models')
const SeriesModel = require('../../models/series.js')

const { propTest, assnTest, actionTest } = require('./lib/testTools.js')

describe('# Series Model', () => {
  propTest(SeriesModel, 'Series', ['name'])
  assnTest(SeriesModel, [['hasMany', 'Product']])
  actionTest(db.Series)
})