const db = require('../models')
const CartItem = db.CartItem

module.exports = {
  async getCartItem(req, res, next) {
    const cartId = req.session.cartId
    if (cartId) {
      // 購物車，商品計數
      res.locals.itemSum = await CartItem.sum('quantity', {
        where: { CartId: cartId }
      })

      // 傳遞被加入購物車之商品 data
      const { productName, productImg } = req.flash('addedItem')[0] || {}
      res.locals.itemName = productName
      res.locals.itemImg = productImg
    }

    next()
  }
}