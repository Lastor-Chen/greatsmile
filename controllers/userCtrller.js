const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const { checkSignUp } = require('../lib/checker.js')

module.exports = {
  getSignUp: (req, res) => {
    res.render('signup')
  },

  signUp: async (req, res) => {
    try {
      const input = { ...req.body }  // 深拷貝，保護原始資料

      // check input
      const error = await checkSignUp(input)
      if (error) return res.render('signup', { error, input })

      input.avatar = '/img/default.png'
      input.introduction = ''
      input.password = bcrypt.hashSync(input.password, 10)
      await User.create(input)

      req.flash('success', '已成功註冊帳號')
      res.redirect('/signin')

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  getSignIn: (req, res) => {
    return res.render('signin')
  },

  signIn: (passport, req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/admin',
      successFlash: true,
      failureRedirect: '/signin',
      failureFlash: true,
      badRequestMessage: '請輸入 Email 與 Passport'
    })(req, res, next)
  },

  signOut: (req, res) => {
    req.flash('success', '登出成功！')
    req.logout()
    res.redirect('/')
  },
}