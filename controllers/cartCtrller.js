const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem

module.exports = {
  async postCart(req, res) {
    try {
      const QTY_Limit = 3

      const cartId = req.session.cartId || null
      const product_id = req.body.productId  // sequelize bug，得用底線命名
      const { productName, productImg } = req.body
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
        await cartItem.update({ quantity: QTY_Limit })
        req.flash('error', '超過單件商品之最大購買數量，已為您調整為最大購買數量。')
        req.flash('addedItem', { productName, productImg })
        return res.redirect('back')
      } 
      
      await cartItem.update({ quantity: (currentQty + inputQty) })
      req.flash('success', '已成功加進購物車')
      req.flash('addedItem', { productName, productImg })
      res.redirect('back')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}