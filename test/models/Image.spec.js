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
const ImageModel = require('../../models/image.js')

describe('# Image Model', () => {
  const Image = ImageModel(sequelize, dataTypes)
  const image = new Image()
  checkModelName(Image)('Image')

  context('properties', () => {
    ['url', 'ProductId'].forEach(checkPropertyExists(image))
  })

  context('associations', () => {
    const Product = 'Product'
    before(() => {
      Image.associate({ Product })
    })

    it('should belongsTo Product', () => {
      expect(Image.belongsTo).to.have.been.calledWith(Product)
    })
  })

  context('action', () => {
    let data = null

    it('create', async () => {
      try {
        const image = await db.Image.create({})
        data = image

      } catch (err) {
        console.error(err)
      }
    })

    it('read', async () => {
      try {
        const image = await db.Image.findByPk(data.id)
        expect(data.id).to.be.equal(image.id)

      } catch (err) {
        console.error(err)
      }
    })

    it('update', async () => {
      try {
        await db.Image.update({}, { where: { id: data.id } })
        const image = await db.Image.findByPk(data.id)
        expect(data.updatedAt).to.be.not.equal(image.updatedAt)

      } catch (err) {
        console.error(err)
      }
    })

    it('delete', async () => {
      try {
        await db.Image.destroy({
          where: { id: data.id },
          // 重置 id 流水號
          truncate: true,
          restartIdentity: true
        })
        const image = await db.Image.findByPk(data.id)
        expect(image).to.be.equal(null)

      } catch (err) {
        console.error(err)
      }
    })
  })
})