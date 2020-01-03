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

  postTags: async (req, res) => {
    try {
      const input = { ...req.body }

      await Tag.create(input)

      res.redirect('/admin/tags')

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

  getEditPage: async (req, res) => {
    try {

      const id = req.params.tagsid
      const tag = await Tag.findByPk(id)

      const tags = await Tag.findAll({
        order: [['id', 'DESC']]
      })

      res.render('admin/tags', { tag, tags })

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

  putTag: async (req, res) => {
    try {

      const input = { ...req.body }
      const id = req.params.tagsid
      const tag = await Tag.findByPk(id)

      await tag.update(input)

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