const router = require('express').Router()
const tagCtrller = require('../../controllers/admin/tagCtrller')

// route base '/admin/tags'
router.get('/', tagCtrller.getTags)
router.post('/', tagCtrller.postTags)
router.get('/:tagsid', tagCtrller.getEditPage)
router.put('/:tagsid', tagCtrller.putTag)

module.exports = router