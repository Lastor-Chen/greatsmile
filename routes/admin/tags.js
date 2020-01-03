const router = require('express').Router()
const tagCtrller = require('../../controllers/admin/tagCtrller')

// route base '/admin/tags'
router.get('/', tagCtrller.getTags)

module.exports = router