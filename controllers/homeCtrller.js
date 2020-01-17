module.exports = {
  async getHome(req, res) {
    try {
      res.render('home')
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}