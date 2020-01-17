const db = require('../models')
const Tag = db.Tag

module.exports = {
  // 取得 tag 名稱
  getTagGroup: async (req, res, next) => {
    try {
      const tagGroup = await Tag.findAll({ attributes: ['id', 'name'] })
      res.locals.tagGroup = tagGroup

      next()

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}
