const db = require('../../models')
const { User } = db


module.exports = {
  getUsers: async (req, res) => {
    try {

      res.render('admin/users', { css: 'admin' })
    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },
}