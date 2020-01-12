const router = require('express').Router()
const giftCtrller = require('../../controllers/admin/giftCtrller')

// route base '/admin/series
router.get('/', giftCtrller.getGifts)
router.post('/', giftCtrller.postGift)
router.put('/:giftsid', giftCtrller.putGift)
// router.delete('/:giftsid', giftCtrller.deleteGifts)

module.exports = router