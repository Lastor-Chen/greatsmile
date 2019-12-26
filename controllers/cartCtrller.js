const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem

module.exports = {
  async postCart(req, res) {
    try {
      const cartId = req.session.cartId || null
      const product_id = req.body.productId

      // 確認 client 是否已有 cart，若無就給一個
      const [cart] = await Cart.findOrCreate({ where: { id: cartId } })

      // 確認 cart 是否已有 item，若無就給一個
      const [cartItem] = await CartItem.findOrCreate({ where: { CartId: cart.id, product_id } })

      // 遞增目標商品數量
      await cartItem.increment('quantity')

      // 發 session 紀錄用戶是哪台 cart
      req.session.cartId = cart.id
      await req.session.save()

      res.redirect('back')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}