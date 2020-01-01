const router = require('express').Router()
const orderCtrller = require('../controllers/orderCtrller.js')

// route base '/order'
router.get('/', orderCtrller.addressPage)
router.get('/delivery-method', orderCtrller.deliveryPage)

module.exports = router