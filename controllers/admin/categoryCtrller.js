const db = require('../../models')
const { Category } = db


module.exports = {
  getCategories: async (req, res) => {
    try {
      
    

    res.render('admin/categories')
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
}