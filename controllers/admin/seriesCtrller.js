const db = require('../../models')
const { Series } = db


module.exports = {
  getSeries: async (req, res) => {
    try {
      const series = await Series.findAll({
        order: [['id', 'DESC']]
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

        await Series.create(input)

        req.flash('success', '新增成功！')
        res.redirect('/admin/series')

      }

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

  getEditPage: async (req, res) => {
    try {

      const id = req.params.seriesid
      const pickedSeries = await Series.findByPk(id)

      const series = await Series.findAll({
        order: [['id', 'DESC']]
      })

      res.render('admin/Series', { pickedSeries, series })

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

        const id = req.params.seriesid
        const series = await Series.findByPk(id)

        await series.update(input)

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

      const id = req.params.seriesid
      series = await Series.findByPk(id)
      await series.destroy()

      req.flash('success', '刪除成功！')
      res.redirect('/admin/series')

    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },

} 