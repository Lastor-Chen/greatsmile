const router = require('express').Router()
const orderCtrller = require('../controllers/orderCtrller.js')

// route base '/orders'
router.get('/checkout', orderCtrller.getCheckout)       // 結帳入口
router.get('/checkout-1', orderCtrller.getCheckout_1)   // 地址頁
router.post('/checkout-1', orderCtrller.checkout_1)     // post 地址

router.get('/checkout-2', orderCtrller.getCheckout_2)   // 取貨方式頁
router.post('/checkout-2', orderCtrller.checkout_2)     // post 取貨

router.get('/checkout-3', orderCtrller.getCheckout_3)   // 付款方式頁
router.post('/checkout-3', orderCtrller.checkout_3)     // post 付款

router.get('/checkout-4', orderCtrller.getCheckout_4)   // 確認頁
router.post('/', orderCtrller.postOrder)                // post 成立訂單

module.exports = router