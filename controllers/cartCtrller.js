const db = require('../models')
const Product = db.Product
const { Cart, CartItem} = db

const Op = require('sequelize').Op
const moment = require('moment')
moment.locale('zh-tw')

module.exports = {
  getCart: async (req, res) => {
    try {
      let cart = await Cart.findByPk(req.session.cartId, {
        include: [{
          model: Product, as: 'products',
          include: ['Gifts', 'Images']
        }],
        order: [['products', CartItem, 'id', 'DESC']]
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
          totalPrice += (product.price * product.CartItem.quantity)
        })
      }
      const totalPriceFormat = totalPrice.toLocaleString()

      res.render('cart', { cart, cartProducts, totalPriceFormat, css: 'cart', js: 'cart'})

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
      if (!cart.UserId && req.user) { await cart.update({ UserId: req.user.id }) }

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

  updateCartItem: async (req, res) => {
    try {
      const QTY_Limit = 3

      const cartItem = await CartItem.findByPk(req.params.id, {
        include: { model: Product, attributes: ['name', 'inventory'] }
      })
      let inventory = cartItem.Product ? cartItem.Product.inventory : null
      const inputQty = req.body.productQty || 1

      // 當 input 的數量大於3時將阻擋，並只能更改為最大上限
      if (inputQty > QTY_Limit) {
        await cartItem.update({
          quantity: QTY_Limit
        })

        req.flash('error', `${cartItem.Product.name} 超過單件商品之最大購買數量，已為您調整為最大購買數量。`)
        return res.redirect('back')
      }
      
      // 當 input 的數量大於庫存數時會跳出提醒，並把值變更為庫存數的量
      if (inventory < inputQty) {
        await cartItem.update({
          quantity: inventory
        })
        req.flash('error', `${cartItem.Product.name} 商品庫存剩 ${inventory} 件，已為您調整為上限數`)
        return res.redirect('back')
      }
      
      // input 的數小於等於 0 時刪除此商品
      if (inputQty <= 0) {
        await cartItem.destroy()
        req.flash('success', '商品已從購物車移除。')
        return res.redirect('back')
      }

      await cartItem.update({
        quantity: inputQty
      })
      req.flash('success', `${cartItem.Product.name} 商品數量更新成功。`)

      return res.redirect('back')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  deleteCartItem: async (req, res) => {
    try {
      const cartItem = await CartItem.findByPk(req.params.id)
      await cartItem.destroy()
      req.flash('success', '商品已從購物車移除。')
      
      return res.redirect('back')

    } catch(err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  setCart: async (req, res) => {
    try {
      const CartId = req.session.cartId || null
      const UserId = req.user.id

      const cart = await Cart.findOne({
        where: { [Op.or]: { id: CartId, UserId } }
      })
      console.log('cart', cart && cart.dataValues)

      // 無持有購物車
      if (!cart) return res.redirect('/admin')

      // user 有車
      if (cart.UserId) {
        // 訪客無車
        if (!CartId) {
          console.log('U有車, !CartId')
          req.session.cartId = cart.id
        }

        // 訪客有車
        if (CartId) {
          console.log('U有車, CartId')
          console.log(cart.id)
          // 訪客購物車 items 併入 user 購物車
          const items = await CartItem.findAll({ where: { CartId } })

          items.forEach(async item => {
            try {
              const [cartItem, wasCreated] = await CartItem.findOrCreate({
                where: { CartId: cart.id, product_id: item.product_id },
                defaults: { quantity: item.quantity }
              })

              // 有相同商品
              if (!wasCreated) {
                const sum = cartItem.quantity + item.quantity

                await cartItem.update({
                  quantity: sum > 3 ? 3 : sum
                })
              }

            } catch (err) { console.error(err) }
          })

          // 換車
          req.session.cartId = cart.id

          // 移除訪客購物車
          // const cart = await Cart.findByPk(CartId)
          // await Cart.destroy({ where: { id: CartId } })
        }
      }

      // user 無車
      if (!cart.UserId) {
        console.log('U無車')
        await cart.update({ UserId })
      }

      return res.redirect('/admin')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
}