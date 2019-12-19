process.env.NODE_ENV = 'test'

const db = require('../../models')
const ProductModel = require('../../models/product.js')
const { propTest, assnTest, actionTest } = require('./lib/testTools.js')

const props = [
  'name',
  'price',
  'inventory',
  'slogan',
  'description',
  'spec',
  'copyright',
  'maker',
  'status',
  'releaseDate',
  'saleDate',
  'deadline',
  'SeriesId',
  'CategoryId'
]

describe('# Product Model', () => {
  propTest(ProductModel, 'Product', props)
  assnTest(ProductModel, [
    ['hasMany', 'Image'],
    ['hasMany', 'Gift'],
    ['belongsTo', 'Series'],
    ['belongsTo', 'Category'],
    ['belongsToMany', 'Tag']
  ])
  actionTest(db.Product)
})