process.env.NODE_ENV = 'test'

const db = require('../../models')
const UserModel = require('../../models/user.js')
const { propTest, assnTest, actionTest } = require('./lib/testTools.js')

const props = [
  'email',
  'password',
  'name',
  'birthday',
  'gender',
  'isAdmin'
]

describe('# User Model', () => {
  propTest(UserModel, 'User', props)
  assnTest(UserModel, [
    ['hasMany', 'Order']
  ])
  actionTest(db.User)
})