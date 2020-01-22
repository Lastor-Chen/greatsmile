const router = require('express').Router()
const orderCtrller = require('../../controllers/admin/orderCtrller')

// route base '/admin/orders'
router.get('/', orderCtrller.getOrders)
router.post('/:ordersid/ship', orderCtrller.swtichShipStatus)
router.put('/:ordersid/cancel', orderCtrller.cancelOrder)
router.put('/:ordersid' , orderCtrller.putOrderInfo)


module.exports = router