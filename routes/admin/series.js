const router = require('express').Router()
const seriesCtrller = require('../../controllers/admin/seriesCtrller')

// route base '/admin/series
router.get('/', seriesCtrller.getSeries)
router.post('/', seriesCtrller.postSeries)
router.put('/:seriesid', seriesCtrller.putSeries)
router.delete('/:seriesid', seriesCtrller.deleteSeries)

module.exports = router