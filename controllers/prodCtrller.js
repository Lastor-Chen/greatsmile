const db = require('../models')
const { Product } = db
const moment = require('moment')

module.exports = {
  getProducts: async(req, res) => {
    try{
      const products = await Product.findAll({
        include: ['Images', 'Gifts'],
        order: [['saleDate', 'DESC']]
      })

      const today = new Date()
      products.forEach(product => {
        product.firstimage = product.Images[0]
        product.isPreorder = moment(today).isBefore(product.deadline)
        product.isGift = product.Gifts.length > 0 ? true :false
      });  

      return res.render('products', { products, css: 'products' })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
}
