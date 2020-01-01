const db = require('../models')
const Cart = db.Cart

module.exports = {
  async viewPage(req, res) {
    try {
      
      res.render('view', { css: 'view' })

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}