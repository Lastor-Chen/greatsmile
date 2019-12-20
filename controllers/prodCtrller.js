module.exports = {
  getProducts: (req, res) => {
    res.send('products')
  },

  getProduct: (req, res) => {
    res.render('product')
  }
}
