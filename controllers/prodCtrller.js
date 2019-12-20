const db = require('../models')
const Product = db.Product

const moment = require('moment')
moment.locale('zh-tw')

module.exports = {
  getProducts: (req, res) => {
    res.send('products')
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(+req.params.id, { 
        include: ['Gifts', 'Images', 'tags', 'Series'] 
      })
      product.mainImg = product.Images[0].url
      product.saleDateFormat = moment(product.saleDate).format('YYYY年MM月')
      product.releaseDateFormat = moment(product.releaseDate).format('YYYY年MM月DD日(dd)')
      product.deadlineFormat = moment(product.deadline).format('YYYY年MM月DD日(dd)')
      product.hasGift = product.Gifts.length !== 0 ? true : false

      res.render('product', { product })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}
