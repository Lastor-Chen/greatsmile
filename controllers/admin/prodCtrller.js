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

      //判斷日期用
      const today = new Date()

      products.forEach(product => {
        //寫入第一筆圖片, 若無商品圖則寫入無圖片圖示
        if (product.Images.length != 0) {
          product.imageUrl = product.Images[0].url
        } else {
          product.imageUrl = 'https://citainsp.org/wp-content/uploads/2016/01/default.jpg'
        }

        //判斷發售狀態
        if (product.saleDate.valueOf() > today.valueOf()) {
          product.saleStatus = '未發售'
        } else {
          product.saleStatus = '已發售'
        }

      })
      res.render('admin/products', { products })
    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

  getAddPage: (req, res) => {
    res.render('admin/new')
  }

}
