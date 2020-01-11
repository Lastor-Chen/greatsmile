const router = require('express').Router()
const orderCtrller = require('../controllers/orderCtrller.js')

// route base '/orders'
router.get('/checkout', orderCtrller.setCheckout)      // 結帳入口

router.get('/checkout_1', orderCtrller.getCheckout)    // 地址頁
router.post('/checkout_1', orderCtrller.checkout_1)    // post 地址

router.get('/checkout_2', orderCtrller.getCheckout)    // 取貨方式頁
router.post('/checkout_2', orderCtrller.checkout_2)    // post 取貨

router.get('/checkout_3', orderCtrller.getCheckout)    // 付款方式頁
router.post('/checkout_3', orderCtrller.checkout_3)    // post 付款

router.get('/checkout_4', orderCtrller.getCheckout)    // 確認頁
router.post('/', orderCtrller.postOrder)               // post 成立訂單

router.get('/success', orderCtrller.getSuccessOrder)   // 訂單成立頁

module.exports = router