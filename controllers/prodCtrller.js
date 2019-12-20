const db = require('../models')
const Product = db.Product

module.exports = {
  getProducts: (req, res) => {
    res.send('products')
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(+req.params.id, { 
        include: ['Gifts', 'Images', 'tags', 'Series'] 
      })
      console.log(product.dataValues)
      product.mainImg = product.Images[0].url
      product.release = product.releaseDate.toLocaleDateString()
      product.dead = product.deadline.toLocaleDateString()
      product.hasGift = product.Gifts.length !== 0 ? true : false

      res.render('product', { product })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}
