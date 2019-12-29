const router = require('express').Router()
const userCtrller = require('../../controllers/admin/userCtrller')

// route base '/admin/users'
router.get('/', userCtrller.getUsers)

module.exports = router