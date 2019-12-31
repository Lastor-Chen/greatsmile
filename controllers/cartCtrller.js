const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const CartItem = db.CartItem

const moment = require('moment')
moment.locale('zh-tw')

module.exports = {
  getCart: async (req, res) => {
    try {
      let cart = await Cart.findByPk(req.session.cartId, {
        include: [{
          model: Product, as: 'products',
          include: ['Gifts', 'Images']
        }]
      })
      cart = cart || { products: [] }
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
        )
      }
      const totalPriceFormat = totalPrice.toLocaleString()

      res.render('cart', { cart, cartProducts, totalPriceFormat, css: 'cart' })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
  postCart: async (req, res) => {
    try {
      const QTY_Limit = 3

      const cartId = req.session.cartId || null
      const product_id = +req.body.productId  // sequelize bug，得用底線命名
      const { productName, productImg } = req.body
      const inputQty = +req.body.quantity || 1

      // 確認 client 是否已有 Cart，若無就給一個
      const [cart] = await Cart.findOrCreate({ where: { id: cartId } })

      // 發 session 紀錄用戶是哪台 cart
      req.session.cartId = cart.id
      await req.session.save()

      // 確認 CartItem 是否已有 record，若無建一個
      const [cartItem, wasCreated] = await CartItem.findOrCreate({
        where: { CartId: cart.id, product_id },
        include: { model: Product, attributes: ['inventory'] }
      })
      const currentQty = cartItem.quantity || 0

      // 確認庫存，商品首次被加購物車 cartItem.Product 為空
      // 只有首次加入時，才 Query Product 查庫存
      let inventory = cartItem.Product ? cartItem.Product.inventory : null
      if (wasCreated) {
        const product = await Product.findByPk(product_id)
        inventory = product.inventory
      }

      if (inventory - (currentQty + inputQty) < 0) {
        // 庫存不足時，刪除已 create 的紀錄
        if (currentQty === 0) { await cartItem.destroy() }
        req.flash('addedItem', { productName, productImg, msg: '選購的商品已無庫存。' })
        return res.redirect('back')
      }

      // 計算商品數量
      if (currentQty + inputQty > QTY_Limit) {
        await cartItem.update({ quantity: QTY_Limit })
        req.flash('addedItem', {
          productName, productImg, msg: '超過單件商品之最大購買數量，已為您調整為最大購買數量。'
        })
        return res.redirect('back')
      }

      await cartItem.update({ quantity: (currentQty + inputQty) })
      req.flash('addedItem', { productName, productImg, msg: '已成功加進購物車' })
      res.redirect('back')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
}