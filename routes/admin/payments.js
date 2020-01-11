const router = require('express').Router()
const paymentCtrller = require('../../controllers/admin/paymentCtrller')

// route base '/admin/payments'
router.get('/', paymentCtrller.getpayments)

module.exports = router