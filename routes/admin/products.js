const router = require('express').Router()
const prodCtrller = require('../../controllers/admin/prodCtrller.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// route base '/admin/products'

router.get('/', prodCtrller.getProducts)
router.get('/new', prodCtrller.getAddPage)
router.get('/:id/edit', prodCtrller.getEditPage)
router.get('/:id/preview', prodCtrller.getProduct)

router.post('/', upload.array('image', 10), prodCtrller.postNewProduct)
router.post('/:id/display', prodCtrller.postDisplay)
router.post('/:id/undisplay', prodCtrller.postUndisplay)

router.put('/:id', upload.array('image', 10), prodCtrller.putProduct)

router.delete('/:id', prodCtrller.deleteProduct)

router.delete('/images/:id', prodCtrller.deleteImage)

module.exports = router
