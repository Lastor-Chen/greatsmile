const db = require('../../models')
const { Category } = db


module.exports = {
  getCategories: async (req, res) => {
    try {

      const categories = await Category.findAll({
        order: [['id', 'DESC']]
      })

      res.render('admin/categories', { categories })
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },
}