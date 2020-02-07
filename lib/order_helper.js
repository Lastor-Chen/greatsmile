const db = require('../models')
const Op = db.Sequelize.Op
const { sequelize, Product, Order, OrderItem, CartItem } = db

module.exports = {
  async checkInv(data) {
    try {
      // Query Product
      const cartProds = data.cart.products
      const queryArray = cartProds.map(prod => ({ id: prod.id }))
      const products = await Product.findAll({ where: { [Op.or]: queryArray } })

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

    } catch (err) { return err.toString() }
  },

  async txnOrder(userId, data) {
    try {
      const order = await sequelize.transaction(async t => {
        // 扣除商品庫存
        for (const prod of data.cart.products) {
          await Product.decrement(
            { inventory: prod.CartItem.quantity },
            { where: { id: prod.id }, transaction: t },
          )
        }

        // Create Order
        const order = await Order.create({
          ...data,
          UserId: userId,
          payStatus: false,
          shipStatus: false
        }, { transaction: t })

        // 加入單號 SN
        order.sn = ("000000000" + order.id).slice(-10)
        await order.save({ transaction: t })

        // Create OrderItem
        const cart = data.cart
        for (const prod of cart.products) {
          await OrderItem.create({
            price: prod.price,
            quantity: prod.quantity,
            OrderId: order.id,
            product_id: prod.id
          }, { transaction: t })
        }

        // 清除購物車 items
        await CartItem.destroy({ where: { CartId: cart.id }, transaction: t })

        return order
      })

      return order

    } catch (err) { return err }
  }
}