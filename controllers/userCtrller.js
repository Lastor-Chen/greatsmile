const bcrypt = require('bcryptjs')
const passport = require('passport')
const db = require('../models')
const { User } = db

const { checkSignUp } = require('../lib/checker.js')

module.exports = {
  signUp: async (req, res, next) => {
    try {
      // check input
      const input = { ...req.body }  // 深拷貝，保護原始資料
      const signUpError = await checkSignUp(input)

      // 判斷來源頁面
      const isCheckout = req.body.from ? true : false

      if (signUpError) {
        return res.render('sign', { signUpError, input, isCheckout, css: 'sign', js: 'sign' })
      }

      // 整理 input 資料
      input.name = input.lastName + input.firstName
      input.nickname = input.firstName
      input.password = bcrypt.hashSync(input.password, 10)
      input.isAdmin = false
      await User.create(input)

      // 自動登入
      passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: `/users/signin`,
        failureFlash: true,
      })(req, res, next)

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  getSignIn: (req, res) => {
    // 判斷來源頁面
    const isCheckout = req.path.includes('checkout')
    res.render('sign', { isCheckout, css: 'sign', js: 'sign'})
  },

  signIn: (req, res, next) => {
    // 判斷來源頁面
    const from = req.body.from || ''

    passport.authenticate('local', {
      successRedirect: '/admin',
      successFlash: true,
      failureRedirect: `/users/signin${from}`,
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
}