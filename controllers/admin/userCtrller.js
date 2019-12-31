const db = require('../../models')
const { User, Order } = db


module.exports = {
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        order: [['id', 'DESC']],
        include: [Order]
      })

      users.forEach(user => {
        user.modifybirthday = user.birthday.toJSON().split('T')[0]
        user.orderCount = user.Orders.length
      })


      res.render('admin/users', { users })
    } catch (err) {
      console.error(err)
      res.status(500).json(err.toString())
    }
  },
}