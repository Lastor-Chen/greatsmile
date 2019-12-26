const router = require('express').Router()
const prodCtrller = require('../../controllers/admin/prodCtrller.js')

const { isAdminAuth } = require('../../middleware/auth')



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

router.post('/products/', prodCtrller.postNewProduct)
router.post('/products/:id/display', prodCtrller.postDisplay)
router.post('/products/:id/undisplay', prodCtrller.postUndisplay)


router.delete('/products/:id', prodCtrller.deleteProduct)

module.exports = router
