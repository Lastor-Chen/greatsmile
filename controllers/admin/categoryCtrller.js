const db = require('../../models')
const { Category } = db


module.exports = {
  getCategories: async (req, res) => {
    try {

      const categories = await Category.findAll({
        order: [['id', 'ASC']]
      })

      res.render('admin/categories', { categories })
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  postCategories: async (req, res) => {
    try {
      const input = { ...req.body }
      if (input.name.trim() === '') {

        req.flash('error', '分類名稱不能為空白')
        res.redirect('/admin/categories')

      } else {

        const maxId = await Category.max('id')
        await Category.create({ id: maxId + 1, ...input })

        req.flash('success', '新增成功！')
        res.redirect('/admin/categories')

      }

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

  putCategory: async (req, res) => {
    try {
      const input = { ...req.body }

      if (input.name.trim() === '') {

        req.flash('error', '分類名稱不能為空白')
        res.redirect('back')

      } else {

        const id = +req.params.categoriesid
        await Category.update(input, { where: { id } })

        req.flash('success', '更新成功！')
        res.redirect('/admin/categories')

      }

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

  deleteCategory: async (req, res) => {
    try {

      const id = +req.params.categoriesid
      await Category.destroy({ where: { id } })

      req.flash('success', '刪除成功！')
      res.redirect('/admin/categories')

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

}