const router = require('express').Router()
const prodCtrller = require('../../controllers/admin/prodCtrller.js')

const { isAdminAuth } = require('../../middleware/auth')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// route base '/admin'
router.use('/', isAdminAuth)
// set admin layout
router.use('/', (req, res, next) => {
  res.locals.layout = 'admin'
  next()
})

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
