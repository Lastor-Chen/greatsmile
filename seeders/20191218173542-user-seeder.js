'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users',
      Array.from({ length: 10 }, (val, index) => ({
        email: index === 0 ? 'root@example.com' : `user${index}@example.com`,
        password: bcrypt.hashSync('12345678', 10),
        name: index === 0 ? 'root' : faker.name.findName(),
        birthday: faker.date.past(30),
        gender: index < 6 ? 'M' : 'F',
        is_admin: index === 0 ? 1 : 0
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return queryInterface.bulkDelete('users', null, option)
  }
};
