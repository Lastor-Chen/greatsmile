const db = require('../models')
const { Product } = db
const moment = require('moment')

module.exports = {
  getProducts: async(req, res) => {
    try{
      const products = await Product.findAll({
        include: ['Images', 'Gifts'],
        order: [['saleDate', 'DESC']],
        where: {status: 1}
      })

      const today = new Date()
      products.forEach(product => {
        product.mainImg = product.Images.find(img => img.isMain).url
        product.priceFormat = product.price.toLocaleString()
        product.isPreorder = moment(today).isBefore(product.deadline)
        product.isGift = product.Gifts.length > 0 ? true :false
        product.hasInv = (product.inventory !== 0)
      });  

      return res.render('products', { products, css: 'products' })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
}
