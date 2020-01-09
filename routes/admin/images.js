const router = require('express').Router()
const imageCtrller = require('../../controllers/admin/imageCtrller')

// route base '/admin/orders'
router.delete('/:id', imageCtrller.deleteImage)

module.exports = router