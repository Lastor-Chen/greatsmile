const router = require('express').Router()
const orderCtrller = require('../../controllers/admin/orderCtrller')

// route base '/admin/orders'
router.get('/', orderCtrller.getOrders)

module.exports = router