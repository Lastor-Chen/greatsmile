const nodemailer = require('nodemailer');
const db = require('../models')


module.exports = {
  async getHome(req, res) {
    try {

    } catch (err) {
      console.error(err)
      res.status(500).json({ status: 'serverError', message: err.toString() })
    }
  }
}