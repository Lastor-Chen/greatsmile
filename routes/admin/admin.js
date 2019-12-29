const router = require('express').Router()
const prodCtrller = require('../../controllers/admin/prodCtrller.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const { isAdminAuth } = require('../../middleware/auth')

// 判斷 admin 權限，set admin layout
router.use('/', isAdminAuth, (req, res, next) => {
  res.locals.layout = 'admin'
  next()
})

// route base '/admin'
router.get('/', (req, res) => res.redirect('/admin/products'))
router.get('/products', prodCtrller.getProducts)
router.get('/products/new', prodCtrller.getAddPage)
router.get('/products/:id/edit', prodCtrller.getEditPage)

router.post('/products/', upload.array('image', 10), prodCtrller.postNewProduct)
router.post('/products/:id/display', prodCtrller.postDisplay)
router.post('/products/:id/undisplay', prodCtrller.postUndisplay)

router.put('/products/:id', upload.array('image', 10), prodCtrller.putProduct)


router.delete('/products/:id', prodCtrller.deleteProduct)

module.exports = router
