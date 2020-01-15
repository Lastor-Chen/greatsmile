const db = require('../models')
const Category = db.Category

module.exports = {
  // 取得 navbar 分類名稱
  getCategoryBar: async (req) => {
    try {
      const categoryBar = await Category.findAll({ attributes: ['name']})
      return categoryBar

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
  
}
