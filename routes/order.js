const router = require('express').Router()
const orderCtrller = require('../controllers/orderCtrller.js')

// route base '/order'

router.get('/view', orderCtrller.viewPage)

module.exports = router