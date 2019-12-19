process.env.NODE_ENV = 'test'

const db = require('../../models')
const ImageModel = require('../../models/image.js')

const { propTest, assnTest, actionTest } = require('./lib/testTools.js')

describe('# Image Model', () => {
  propTest(ImageModel, 'Image', ['url', 'ProductId'])
  assnTest(ImageModel, [['belongsTo', 'Product']])
  actionTest(db.Image)
})