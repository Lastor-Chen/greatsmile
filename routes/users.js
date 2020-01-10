const router = require('express').Router()
const userCtrller = require('../controllers/userCtrller')
const { isAuth } = require('../middleware/auth')

// route base '/users'
router.get('/', (req, res) => res.send('users page'))
router.post('/signup', userCtrller.signUp)
router.get('/signin', userCtrller.getSignIn)
router.get('/signin/checkout', userCtrller.getSignIn)
router.post('/signin', userCtrller.signIn)
router.get('/signout', userCtrller.signOut)

router.get('/profile', isAuth, userCtrller.getProfile)
router.get('/orders', isAuth, userCtrller.getOrders)

module.exports = router
