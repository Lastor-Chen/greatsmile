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

module.exports = {
  /**
   * 測試 Model 名稱、屬性是否正確。
   */
  propTest: (targetModel, name, attrArray) => {
    const Model = targetModel(sequelize, dataTypes)
    const model = new Model()
    checkModelName(Model)(name)

    context('properties', () => {
      attrArray.forEach(checkPropertyExists(model))
    })
  },
  /**
   * 測試 Model 關聯是否建立
   */
  assnTest: (targetModel, options) => {
    const Model = targetModel(sequelize, dataTypes)

    context('associations', () => {
      options.forEach(item => {
        const [method, assnString] = item
        Model.associate({ [assnString]: assnString })

        it(`should ${method} ${assnString}`, () => {
          expect(Model[method]).to.have.been.calledWith(assnString)
        })
      })
    })
  },
  /**
   * 測試 Model CRUD 是否工作
   */
  actionTest: (dbModel) => {
    context('action', () => {
      let data = null

      it('create', async () => {
        try {
          const result = await dbModel.create({})
          data = result

        } catch (err) {
          console.error(err)
        }
      })

      it('read', async () => {
        try {
          const result = await dbModel.findByPk(data.id)
          expect(data.id).to.be.equal(result.id)

        } catch (err) {
          console.error(err)
        }
      })

      it('update', async () => {
        try {
          await dbModel.update({}, { where: { id: data.id } })
          const result = await dbModel.findByPk(data.id)
          expect(data.updatedAt).to.be.not.equal(result.updatedAt)

        } catch (err) {
          console.error(err)
        }
      })

      it('delete', async () => {
        try {
          await dbModel.destroy({
            where: { id: data.id },
            // 重置 id 流水號
            truncate: true,
            restartIdentity: true
          })
          const result = await dbModel.findByPk(data.id)
          expect(result).to.be.equal(null)

        } catch (err) {
          console.error(err)
        }
      })
    })
  }
}