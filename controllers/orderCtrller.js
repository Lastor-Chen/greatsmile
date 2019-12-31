const db = require('../models')
const Cart = db.Cart

module.exports = {
  async addressPage(req, res) {
    try {
      const cartId = req.session.cartId
      const cart = await Cart.findByPk(cartId, {
        include: 'products'
      }) 

      console.log(cart && cart.dataValues)

      res.render('address', { css: 'address', cart })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}