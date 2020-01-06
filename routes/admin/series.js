const router = require('express').Router()
const seriesCtrller = require('../../controllers/admin/seriesCtrller')

// route base '/admin/series
router.get('/', seriesCtrller.getSeries)
// router.post('/', seriesCtrller.postSeries)
// router.get('/:categoriesid', seriesCtrller.getEditPage)
// router.put('/:categoriesid', seriesCtrller.putSeries)
// router.delete('/:categoriesid', seriesCtrller.deleteSeries)

module.exports = router