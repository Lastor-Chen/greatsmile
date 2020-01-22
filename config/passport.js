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

  async (email, password, done) => {
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) return done(null, false, { message: '帳號或密碼輸入錯誤' })

      const isSuccess = bcrypt.compareSync(password, user.password)
      if (!isSuccess) return done(null, false, { message: '帳號或密碼輸入錯誤' })

      done(null, user, { message: 'success' })

    } catch (err) { console.error(err) }
  }
))

// serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      user.nickname = user.name.split(' ').slice(-1)
      done(null, user)
    })
    .catch(err => console.error(err))
})

module.exports = passport