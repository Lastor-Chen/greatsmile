const router = require('express').Router()
const tagCtrller = require('../../controllers/admin/tagCtrller')

// route base '/admin/tags'
router.get('/', tagCtrller.getTags)
router.post('/', tagCtrller.postTags)
router.put('/:tagsid', tagCtrller.putTag)
router.delete('/:tagsid', tagCtrller.deleteTag)

module.exports = router