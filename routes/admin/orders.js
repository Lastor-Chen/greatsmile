const router = require('express').Router()
const orderCtrller = require('../../controllers/admin/orderCtrller')

// route base '/admin/orders'
router.get('/', orderCtrller.getOrders)
router.post('/:orderId/ship', orderCtrller.switchShipStatus)
router.put('/:orderId/cancel', orderCtrller.cancelOrder)
router.put('/:orderId' , orderCtrller.putOrderInfo)


module.exports = router