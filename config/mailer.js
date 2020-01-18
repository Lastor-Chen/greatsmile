const nodemailer = require('nodemailer')
const hbsMailer = require('nodemailer-express-handlebars')
const moment = require('moment')
moment.locale('zh-tw')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_KEY
  }
})

const options = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: '/views/email/',
    layoutsDir: '/view/email',
    defaultLayout: '',
    helpers: require('../lib/hbs_helpers.js')
  },
  viewPath: './views/email/',
  extName: '.hbs',
}

transporter.use('compile', hbsMailer(options))

module.exports = {
  transporter,

  getMailObj(data, user, order, sn) {
    //地址去除逗號，頭尾加上空格
    const addressArray = data.address.split(",")
    const postNumber = addressArray.shift() + " "
    const lastNumber = " " + addressArray.pop()
    data.address = postNumber + addressArray.join("") + lastNumber

    //付款期限
    const paymentTerms = moment(order.createdAt).add(3, 'days').format('YYYY/MM/DD')

    return {
      from: `大微笑商店 <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: `【GreatSmile Online Shop】訂單已建立 (單號${sn})`,
      template: 'template',
      context: { sn, data, paymentTerms, user }
    }
  }
}