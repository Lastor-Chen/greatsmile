const db = require('../models')
const Cart = db.Cart

module.exports = {
  async addressPage(req, res) {
    try {
      const cartId = req.session.cartId
      const cart = await Cart.findByPk(1, {
        include: [
          { 
            association: 'products',
            attributes: ['id', 'name', 'price'],
            include: [{
              association: 'Images',
              where: { is_main: true }
            }],
          }
        ]
      })

      console.log(cart.products[0].CartItem)
      res.render('address', { css: 'address', cart })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}