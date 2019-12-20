const db = require('../../models')
const { Product, Category, Series, Image } = db

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
        if (product.Images.length != 0) {
          product.imageUrl = product.Images[0].url
        } else {
          product.imageUrl = 'https://citainsp.org/wp-content/uploads/2016/01/default.jpg'
        }
      })
      res.render('admin/products', { products })
    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  }
}
