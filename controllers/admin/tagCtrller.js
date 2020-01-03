const db = require('../../models')
const { User } = db


module.exports = {
  getTags: async (req, res) => {
    try {

      res.render('admin/tags')
    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },
}