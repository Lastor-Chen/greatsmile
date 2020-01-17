const db = require('../models')
const CartItem = db.CartItem

module.exports = {
  async getCartItem(req, res, next) {
    try {
      const cartId = req.session.cartId
      let itemSum = 0
      if (cartId) {
        // 購物車，商品計數
        itemSum = await CartItem.sum('quantity', {
          where: { CartId: cartId }
        })

        // 傳遞被加入購物車之商品 data
        res.locals.addedItem = req.flash('addedItem')[0]
      }

      // 從 if 拉出，使無 cardId 時，也能顯示計數
      // 僅對無庫存商品 postCart 時，防止 itemSum 為 NaN
      res.locals.itemSum = itemSum || 0

      next()

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}