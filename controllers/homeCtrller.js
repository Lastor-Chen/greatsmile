const nodemailer = require('nodemailer');
const db = require('../models')

const { getCategoryBar } = require('../lib/category.js')

module.exports = {
  async getHome(req, res) {
    try {
      // 取得 navbar 分類
      const categoryBar = await getCategoryBar(req)

      res.render('home', { categoryBar})
    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}