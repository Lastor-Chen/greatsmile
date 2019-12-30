process.env.NODE_ENV = 'test'

const db = require('../../models')
const UserModel = require('../../models/user.js')
const { propTest, assnTest, actionTest } = require('./lib/testTools.js')

const props = [
  'email',
  'password',
  'nickname',
  'name',
  'phone',
  'address',
  'birthday',
  'gender',
  'isAdmin'
]

describe('# User Model', () => {
  propTest(UserModel, 'User', props)
  assnTest(UserModel, [
    ['hasMany', 'Order'],
    ['hasMany', 'Post']
  ])
  actionTest(db.User)
})