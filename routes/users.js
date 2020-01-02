const router = require('express').Router()
const userCtrller = require('../controllers/userCtrller')

// route base '/users'
router.get('/', (req, res) => res.send('users page'))
router.get('/signup', userCtrller.getSignUp)
router.post('/signup', userCtrller.signUp)
router.get('/signin', userCtrller.getSignIn)
router.post('/signin', userCtrller.signIn)
router.get('/signout', userCtrller.signOut)
router.get('/profile', userCtrller.getProfile)

module.exports = router
