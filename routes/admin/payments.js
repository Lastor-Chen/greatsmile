const router = require('express').Router()
const paymentCtrller = require('../../controllers/admin/paymentCtrller')

// route base '/admin/payments'
router.get('/', paymentCtrller.getPayments)

module.exports = router