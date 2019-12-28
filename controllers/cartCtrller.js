const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const CartItem = db.CartItem

const moment = require('moment')
moment.locale('zh-tw')

module.exports = {
  getCart: async(req, res) => {
    try {
      const cart = await Cart.findOne({ 
        include: [{ model: Product, as: 'products', 
                    include: ['Gifts', 'Images']}]
      })
      
      let cartProducts = cart.products
      let totalPrice = 0
      if (cartProducts.length > 0) {
        const today = new Date()
        cartProducts.forEach(product => {
          product.priceFormat = product.price.toLocaleString()
          product.subPriceFormat = (product.price * product.CartItem.quantity).toLocaleString()
          product.mainImg = product.Images.find(img => img.isMain).url
          product.isPreorder = moment(today).isBefore(product.deadline)
          product.isGift = product.Gifts.length > 0 ? true : false
          product.isCheck1 = product.CartItem.quantity < 3 ? true : false
          product.isCheck2 = product.CartItem.quantity > 1 ? true : false
          totalPrice += (product.price * product.CartItem.quantity)
        } 
      )}
      const totalPriceFormat = totalPrice.toLocaleString()
      
      res.render('cart', { cart, cartProducts, totalPriceFormat, css: 'cart' })

    } catch(err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}