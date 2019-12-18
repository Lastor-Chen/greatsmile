const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },

  (email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return done(null, false, { message: '帳號或密碼輸入錯誤' })
        if (!bcrypt.compareSync(password, user.password)) return done(null, false, { message: '帳號或密碼輸入錯誤！' })

        done(null, user, { message: '登入成功' })
      })
      .catch(err => console.error(err))
  }
))

// serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    include: [{ all: true, nested: false }]
  })
    .then(user => done(null, user))
})

module.exports = passport