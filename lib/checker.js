const db = require('../models')
const User = db.User
const Op = require('sequelize').Op

module.exports = {
  checkSignUp: async (input) => {
    const badRequest = Object.values(input).some(val => val === '')
    if (badRequest) return '所有欄位皆為必填'

    if (input.passwordCheck !== input.password) return '兩次密碼不一致，請重新檢查'

    //Regular expression Testing
    const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
    if (input.email.search(emailRule) === -1) return 'email格式有誤'


    // 確認 Email 或 Name 是否重複
    const isExist = await User.findOne({
      where: {
        [Op.or]: [
          { email: { [Op.eq]: input.email } },
          { name: { [Op.eq]: input.name } }
        ]
      }
    })

    if (isExist) {
      const { email, name } = isExist
      if (email === input.email) return 'Email 已被其他使用者註冊'
      if (name === input.name) return 'Name 已被其他使用者註冊'
    }
  },

  checkCheckout1: input => {
    // 檢查必要屬性
    const attrs = [
      'lastName', 'firstName',
      'postCode', 'area', 'zone', 'line1', 'line2',
      'phone'
    ]
    const keys = Object.keys(input)
    const attr = attrs.find(val => !keys.includes(val))
    if (attr) return `缺少屬性 ${attr}`
    
    // 檢查是否有未填，排除 line2
    const badRequest = Object.values(input).some((val, index) => {
      if (index !== 6) return val === ''
    })
    if (badRequest) return '收件人資料有誤，請重新提交'

    // 檢查郵遞區號 3+2
    const isPostCode = /^\d{5}$/.test(input.postCode)
    if (!isPostCode) return '郵遞區號格式錯誤，請輸入3+2格式'

    // 檢查電話格式，(0900-000-000) or 無橫線
    const isPhone = /^09\d{2}(-?\d{3}){2}$/.test(input.phone)
    if (!isPhone) return '手機號碼格式錯誤'
  },
}