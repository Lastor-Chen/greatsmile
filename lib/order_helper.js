const db = require('../models')
const { sequelize } = db

module.exports = {
  checkInv(products, cartProds) {
    // 檢索無庫存商品
    const noInvProds = []
    for (const prod of products) {
      const cartProd = cartProds.find(item => item.id === prod.id)
      const inventory = (prod.inventory - cartProd.CartItem.quantity)
      if (inventory < 0) { noInvProds.push({ name: prod.name, qty: prod.inventory }) }
    }

    if (noInvProds.length) {
      let msg = ''
      for (const prod of noInvProds) {
        msg += `${prod.name}，庫存剩餘 ${prod.qty} 件，已超出您選購的數量\n`
      }
      return msg
    }
  },

  async txnOrder() {
    try {
      await sequelize.transaction(async t => {
        // 扣除商品庫存
        for (const prod of cartProds) {
          await Product.decrement(
            { inventory: prod.CartItem.quantity },
            { where: { id: prod.id }, transaction: t },
          )
        }

        // Create Order
        const order = await Order.create({
          ...data,
          UserId: req.user.id,
          payStatus: false,
          shipStatus: false
        })

        // 加入單號 SN
        const sn = ("000000000" + order.id).slice(-10)
        await order.update({ sn })

        // Create OrderItem
        const cart = data.cart
        for (const prod of cart.products) {
          await OrderItem.create({
            price: prod.price,
            quantity: prod.quantity,
            OrderId: order.id,
            product_id: prod.id
          })
        }
      })

    } catch (error) { return error }
  }
}