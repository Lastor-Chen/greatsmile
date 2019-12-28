if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

const express = require('express')
const exphbs = require('express-handlebars')
const passport = require('./config/passport')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const app = express()
const port = process.env.PORT || 3000

// view engine setup
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./lib/hbs_helpers')
}))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(flash())

app.use(session({
  secret: 'LastWendyTomatoBurger',
  name: 'greatSmile',
  cookie: { maxAge: 80000 },
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// view engine 常用變數
app.use((req, res, next) => {
  console.log(req.method, req.path)
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.user = req.user
  next()
})

// route setup
require('./routes/index.js')(app)

// start server
app.listen(port, () => {
  // app 啟動時，顯示當前 NODE_ENV
  const mode = process.env.NODE_ENV || 'development'
  console.log(`\n[App] Using environment "${mode}".`)
  console.log(`[App] Example app listening on port ${port}!`)
})

module.exports = app
