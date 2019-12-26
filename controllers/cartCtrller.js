const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem

module.exports = {
  async postCart(req, res) {
    const cartId = req.session.cartId || 0
    const productId = req.body.product_id

    // 確認是哪台 cart
    const [cart] = await Cart.findOrCreate({ where: { id: cartId } })
    console.log('cart.id', cart.id)

    // 確認 cart 內容
    const [cartItem] = await CartItem.findOrCreate({
      where: {
        CartId: cart.id,
        product_id: productId
      }
    })
    console.log('cartItem.id', cartItem.id)
    console.log('cartItem.qty', cartItem.quantity)
    
    // 確認 item 數量
    const quantity = (cartItem.quantity || 0) + 1
    await cartItem.update({ quantity })
    console.log('cartItem.qty', cartItem.quantity)

    // 發 session 紀錄用戶是哪台 cart
    req.session.cartId = cart.id
    await req.session.save()

    res.redirect('back')
  }
}