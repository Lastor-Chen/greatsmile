process.env.NODE_ENV = 'test'

const chai = require('chai')
const expect = chai.expect
chai.use(require('sinon-chai'))

const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists 
} = require('sequelize-test-helpers')

const db = require('../../models')
const ProductModel = require('../../models/product.js')

describe('# Product Model', () => {
  const Product = ProductModel(sequelize, dataTypes)
  const product = new Product()
  checkModelName(Product)('Product')

  context('properties', () => {
    [
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
    ].forEach(checkPropertyExists(product))
  })

  context('associations', () => {
    const Image = 'Image'
    const Gift = 'Gift'
    const Series = 'Series'
    const Category = 'Category'
    const Tag = 'Tag'
    before(() => {
      Product.associate({ Image })
      Product.associate({ Gift })
      Product.associate({ Series })
      Product.associate({ Category })
      Product.associate({ Tag })
    })

    it('should hasMany Image', () => {
      expect(Product.hasMany).to.have.been.calledWith(Image)
    })
    it('should hasMany Gift', () => {
      expect(Product.hasMany).to.have.been.calledWith(Gift)
    })
    it('should belongsTo Series', () => {
      expect(Product.belongsTo).to.have.been.calledWith(Series)
    })
    it('should belongsTo Category', () => {
      expect(Product.belongsTo).to.have.been.calledWith(Category)
    })
    it('should belongsToMany Tag', () => {
      expect(Product.belongsToMany).to.have.been.calledWith(Tag)
    })
  })

  context('action', () => {
    let data = null

    it('create', async () => {
      try {
        const product = await db.Product.create({})
        data = product

      } catch (err) {
        console.error(err)
      }
    })

    it('read', async () => {
      try {
        const product = await db.Product.findByPk(data.id)
        expect(data.id).to.be.equal(product.id)

      } catch (err) {
        console.error(err)
      }
    })

    it('update', async () => {
      try {
        await db.Product.update({}, { where: { id: data.id } })
        const product = await db.Product.findByPk(data.id)
        expect(data.updatedAt).to.be.not.equal(product.updatedAt)

      } catch (err) {
        console.error(err)
      }
    })

    it('delete', async () => {
      try {
        await db.Product.destroy({ 
          where: { id: data.id },
          // 重置 id 流水號
          truncate: true,
          restartIdentity: true
        })
        const product = await db.Product.findByPk(data.id)
        expect(product).to.be.equal(null)

      } catch (err) {
        console.error(err)
      }
    })
  })
})