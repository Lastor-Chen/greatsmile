const db = require('../../models')
const { Tag } = db


module.exports = {
  getTags: async (req, res) => {
    try {

      const tags = await Tag.findAll({
        order: [['id', 'DESC']]
      })

      res.render('admin/tags', { tags })
    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },
}