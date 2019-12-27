const db = require('../models')
const CartItem = db.CartItem

module.exports = {
  async cartItemSum(req, res, next) {
    const cartId = req.session.cartId
    if (cartId) {
      res.locals.itemSum = await CartItem.sum('quantity', {
        where: { CartId: cartId }
      })
    }

    next()
  }
}