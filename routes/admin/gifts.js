const router = require('express').Router()
const giftCtrller = require('../../controllers/admin/giftCtrller')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// route base '/admin/series
router.get('/', giftCtrller.getGifts)
router.post('/', upload.single('image'), giftCtrller.postGift)
router.put('/:giftsid', upload.single('image'), giftCtrller.putGift)
router.delete('/:giftsid', giftCtrller.deleteGift)

module.exports = router