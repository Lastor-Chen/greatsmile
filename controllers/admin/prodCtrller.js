const db = require('../../models')
const { Product, Category, Series, Image } = db

const moment = require('moment')

module.exports = {
  getProducts: async (req, res) => {
    try {
      const [products] = await Promise.all([
        Product.findAll({
          order: [['id', 'DESC']],
          include: [Category, Series, Image]
        })
      ])

      products.forEach(product => {
        //寫入第一筆圖片, 若無商品圖則寫入無圖片圖示
        if (product.Images.length != 0) {
          product.imageUrl = product.Images[0].url
        } else {
          product.imageUrl = 'https://citainsp.org/wp-content/uploads/2016/01/default.jpg'
        }

        //格式化日期
        product.simplifySale = moment(product.saleDate).format('YYYY/MM/DD')

      })
      console.log(products[0])
      res.render('admin/products', { products })
    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  }
}
