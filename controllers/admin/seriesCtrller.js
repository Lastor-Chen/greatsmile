const db = require('../../models')
const { Series } = db


module.exports = {
  getSeries: async (req, res) => {
    try {
      const series = await Series.findAll({
        order: [['id', 'DESC']]
      })

      res.render('admin/series', { series})
    
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  
} 