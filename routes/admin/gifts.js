const router = require('express').Router()
const giftCtrller = require('../../controllers/admin/giftCtrller')

// route base '/admin/series
router.get('/', giftCtrller.getGifts)
router.post('/', giftCtrller.postGifts)
// router.put('/:giftsid', giftCtrller.putGifts)
// router.delete('/:giftsid', giftCtrller.deleteGifts)

module.exports = router