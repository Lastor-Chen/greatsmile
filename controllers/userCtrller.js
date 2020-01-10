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
      let path = req.body.from
      console.log(req.path)

      if (signUpError) {
        
        return res.render('sign', { signUpError, input, path, css: 'signIn'  })

      } else {

        input.name = input.lastName + input.firstName
        input.nickname = input.firstName
        input.password = bcrypt.hashSync(input.password, 10)
        input.isAdmin = false
        await User.create(input)

        const signUpSuccess = '已成功註冊帳號！'
        return res.render('sign', { signUpSuccess, path, css: 'signIn' })
      }
      
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  getSignIn: (req, res) => {
    let path = req.path
    return res.render('sign', { path, css: 'signIn',js: 'signIn' })
  },

  signIn: (req, res, next) => {
    console.log(req.path)
    passport.authenticate('local', {
      successRedirect: '/admin',
      successFlash: true,
      failureRedirect: `/users${req.body.from}`,
      failureFlash: true,
      badRequestMessage: '請輸入 Email 與 Password'
    })(req, res, next)
  },

  signOut: (req, res) => {
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