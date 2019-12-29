const db = require('../../models')
const { User } = db


module.exports = {
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        order: [['id', 'DESC']]
      })

      users.forEach(user => {
        user.modifybirthday = user.birthday.toJSON().split('T')[0]
      })

      res.render('admin/users', { users, css: 'admin' })
    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },
}