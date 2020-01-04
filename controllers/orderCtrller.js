const db = require('../models')
const Cart = db.Cart

module.exports = {
  async addressPage(req, res) {
    try {
      const cartId = req.session.cartId
      const cart = await Cart.findByPk(cartId, {
        include: [
          { 
            association: 'products',
            attributes: ['id', 'name', 'price'],
            include: [{
              association: 'Images',
              where: { is_main: true }
            }],
          }
        ]
      })

      // 確認有無選購商品
      if (!cart || !cart.products.length) {
        return res.redirect('/cart')
      } 

      // 製作頁面資料
      const products = cart.products
      let totalPrice = 0
      products.forEach(prod => {
        prod.quantity = prod.CartItem.quantity
        prod.amount = (prod.price * prod.quantity)
        totalPrice += prod.amount
      })

      res.render('address', { css: 'delivery', cart, totalPrice })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async deliveryPage(req, res) {
    try {
      const cartId = req.session.cartId
      const cart = await Cart.findByPk(cartId, {
        include: [
          {
            association: 'products',
            attributes: ['id', 'name', 'price'],
            include: [{
              association: 'Images',
              where: { is_main: true }
            }],
          }
        ]
      })

      // 確認有無選購商品
      if (!cart || !cart.products.length) {
        return res.redirect('/cart')
      }

      // 製作頁面資料
      const products = cart.products
      let totalPrice = 0
      products.forEach(prod => {
        prod.quantity = prod.CartItem.quantity
        prod.amount = (prod.price * prod.quantity)
        totalPrice += prod.amount
      })

      // 預設運費
      const totalPrice2 = totalPrice + 150

      res.render('delivery', { css: "delivery", cart, totalPrice, totalPrice2 })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async payPage(req, res) {
    try {
      const cartId = req.session.cartId
      const cart = await Cart.findByPk(cartId, {
        include: [
          {
            association: 'products',
            attributes: ['id', 'name', 'price'],
            include: [{
              association: 'Images',
              where: { is_main: true }
            }],
          }
        ]
      })

      // 確認有無選購商品
      if (!cart || !cart.products.length) {
        return res.redirect('/cart')
      }

      // 製作頁面資料
      const products = cart.products
      let totalPrice = 0
      products.forEach(prod => {
        prod.quantity = prod.CartItem.quantity
        prod.amount = (prod.price * prod.quantity)
        totalPrice += prod.amount
      })

      // 預設運費
      const totalPrice2 = totalPrice + 150

      res.render('pay', { css: "delivery", js: "pay", cart, totalPrice, totalPrice2 })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  async viewPage(req, res) {
    try {
      const cartId = req.session.cartId
      const cart = await Cart.findByPk(cartId, {
        include: [
          {
            association: 'products',
            attributes: ['id', 'name', 'price'],
            include: [{
              association: 'Images',
              where: { is_main: true }
            }],
          }
        ]
      })

      // 確認有無選購商品
      if (!cart || !cart.products.length) {
        return res.redirect('/cart')
      }

      // 製作頁面資料
      const products = cart.products
      let totalPrice = 0
      const shippingFee = 150
      products.forEach(prod => {
        prod.quantity = prod.CartItem.quantity
        prod.amount = (prod.price * prod.quantity)
        totalPrice += prod.amount
      })

      // 預設運費
      const totalPrice2 = totalPrice + shippingFee

      res.render('view', { css: 'view', cart, totalPrice, totalPrice2, shippingFee })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}