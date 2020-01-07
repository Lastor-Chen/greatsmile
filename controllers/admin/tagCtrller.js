const db = require('../../models')
const { Tag } = db


module.exports = {
  getTags: async (req, res) => {
    try {

      const tags = await Tag.findAll({
        order: [['id', 'ASC']]
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
      if (input.name.trim() === '') {

        req.flash('error', '標籤名稱不能為空白')
        res.redirect('/admin/tags')

      } else {

        await Tag.create(input)

        req.flash('success', '新增成功！')
        res.redirect('/admin/tags')
        
      }

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

      if (input.name.trim() === '') {
        
        req.flash('error', '標籤名稱不能為空白')
        res.redirect('back')

      } else {

        const id = req.params.tagsid
        const tag = await Tag.findByPk(id)

        await tag.update(input)

        req.flash('success', '更新成功！')
        res.redirect('/admin/tags')

      }

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

  deleteTag: async (req, res) => {
    try {

      const id = req.params.tagsid
      tag = await Tag.findByPk(id)
      await tag.destroy()

      req.flash('success', '刪除成功！')
      res.redirect('/admin/tags')

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

}