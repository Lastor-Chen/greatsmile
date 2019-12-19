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
  }
}