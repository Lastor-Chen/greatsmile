const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem

module.exports = {
  async postCart(req, res) {
    try {
      const QTY_Limit = 3

      const cartId = req.session.cartId || null
      const product_id = req.body.productId
      const inputQty = +req.body.quantity || 1

      // 確認 client 是否已有 Cart，若無就給一個
      const [cart] = await Cart.findOrCreate({ where: { id: cartId } })

      // 發 session 紀錄用戶是哪台 cart
      req.session.cartId = cart.id
      await req.session.save()

      // 確認 CartItem 是否已有 record，若無建一個
      const [cartItem] = await CartItem.findOrCreate({ where: { CartId: cart.id, product_id } })
      const currentQty = cartItem.quantity || 0

      // 計算商品數量
      if (currentQty + inputQty > QTY_Limit) {
        console.log('不能超過 3 個')
        await cartItem.update({ quantity: QTY_Limit })
        return res.redirect('back')
      } 
      
      await cartItem.update({ quantity: (currentQty + inputQty) })
      res.redirect('back')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}