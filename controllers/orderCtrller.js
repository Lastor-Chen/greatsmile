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

      // 製作頁面資料
      const products = (cart && cart.products) || []
      let totalPrice = 0
      products.forEach(prod => {
        prod.quantity = prod.CartItem.quantity
        prod.amount = (prod.price * prod.quantity)
        totalPrice += prod.amount
      })

      res.render('address', { css: 'address', cart, totalPrice })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}