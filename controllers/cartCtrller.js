const db = require('../models')

module.exports = {
  getCart: (req, res) => {
    res.render('cart', { css: 'cart' })
  }
}