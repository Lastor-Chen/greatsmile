const db = require('../../models')
const { Series } = db


module.exports = {
  getSeries: async (req, res) => {
    try {

     

      res.render('admin/series')
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  
} 