const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem

module.exports = {
  async postCart(req, res) {
    const CartId = req.session.cartId || null
    const product_id = req.body.productId

    const [[cart], [cartItem]] = await Promise.all([
      // 確認 client 是否已有 cart，若無就給一個
      Cart.findOrCreate({ where: { id: CartId } }),
      // 確認 cart 是否已有 item，若無就給一個
      CartItem.findOrCreate({ where: { CartId, product_id } })
    ])
    
    await cartItem.increment('quantity')

    // 發 session 紀錄用戶是哪台 cart
    req.session.cartId = cart.id
    await req.session.save()

    res.redirect('back')
  }
}