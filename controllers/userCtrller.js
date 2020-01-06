const bcrypt = require('bcryptjs')
const passport = require('passport')
const db = require('../models')
const { User, Order, Product } = db

const { checkSignUp } = require('../lib/checker.js')

module.exports = {
  signUp: async (req, res) => {
    try {
      const input = { ...req.body }  // 深拷貝，保護原始資料
      // check input
      const signUpError = await checkSignUp(input)
      if (signUpError) {
        let path = req.path
        return res.render('signin', { signUpError, input, path, css: 'signIn' })
      }
      

      input.name = input.lastName + input.firstName
      input.nickname = input.firstName
      input.password = bcrypt.hashSync(input.password, 10)
      input.isAdmin = false
      input.birthday = new Date
      await User.create(input)

      req.flash('signUpSuccess', '已成功註冊帳號')
      res.redirect('/users/signin')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  getSignIn: (req, res) => {
    let path = req.path
    return res.render('signin', { path, css: 'signIn' })
  },

  signIn: (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/admin',
      successFlash: true,
      failureRedirect: '/users/signin',
      failureFlash: true,
      badRequestMessage: '請輸入 Email 與 Passport'
    })(req, res, next)
  },

  signOut: (req, res) => {
    req.flash('success', '登出成功！')
    req.logout()
    res.redirect('/')
  },

  getProfile: (req, res) => {
    res.render('profile', { css: 'profile' })
  },

  getOrders: async (req, res) => {
    try {
      let orders = await Order.findAll({
        where: { user_id: req.user.id },
        order: [['id', 'DESC']],
        include: {
          model: Product, as: 'products',
          include: ['Gifts', 'Images']
        }
      })

      orders.forEach(order => {
        order.createdTime = order.createdAt.toJSON().split('T')[0]
        order.amountFormat = order.amount.toLocaleString()
        order.products.forEach(product => {
          product.mainImg = product.Images.find(img => img.isMain).url
          product.orderPrice = product.OrderItem.price.toLocaleString()
          product.subPrice = product.OrderItem.quantity * product.price
        })
      })


      res.render('orders', { orders, css: 'profile' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }


  },
}