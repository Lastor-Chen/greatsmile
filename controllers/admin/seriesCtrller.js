const db = require('../../models')
const { Series } = db


module.exports = {
  getSeries: async (req, res) => {
    try {
      const series = await Series.findAll({
        order: [['id', 'ASC']]
      })

      res.render('admin/series', { series })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  },

  postSeries: async (req, res) => {
    try {
      const input = { ...req.body }
      if (input.name.trim() === '') {

        req.flash('error', '分類名稱不能為空白')
        res.redirect('/admin/series')

      } else {

        const maxId = await Series.max('id')
        await Series.create({ id: maxId + 1, ...input })

        req.flash('success', '新增成功！')
        res.redirect('/admin/series')

      }

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

  putSeries: async (req, res) => {
    try {
      const input = { ...req.body }

      if (input.name.trim() === '') {

        req.flash('error', '分類名稱不能為空白')
        res.redirect('back')

      } else {

        const id = +req.params.seriesid
        await Series.update(input, { where: { id } })

        req.flash('success', '更新成功！')
        res.redirect('/admin/series')

      }

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

  deleteSeries: async (req, res) => {
    try {

      const id = +req.params.seriesid
      await Series.destroy({ where: { id } })

      req.flash('success', '刪除成功！')
      res.redirect('/admin/series')

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

} 