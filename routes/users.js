const router = require('express').Router()
const userCtrller = require('../controllers/userCtrller.js')
const cartCtrller = require('../controllers/cartCtrller.js')
const { isAuth } = require('../middleware/auth.js')

// route base '/users'
router.get('/', (req, res) => res.send('users page'))
router.post('/signup', userCtrller.signUp, userCtrller.signIn)
router.get('/signin', userCtrller.getSignIn)
router.get('/signin/checkout', userCtrller.getSignIn)
router.post('/signin', userCtrller.signIn, cartCtrller.setCart)
router.get('/signout', userCtrller.signOut)

router.get('/profile', isAuth, userCtrller.getProfile)

module.exports = router
