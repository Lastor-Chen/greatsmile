'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users',
      Array.from({ length: 10 }, (val, index) => ({
        email: index === 0 ? 'root@example.com' : `user${index}@example.com`,
        password: bcrypt.hashSync('12345678', 10),
        nickname: index === 0 ? 'root' : faker.name.firstName(),
        name: index === 0 ? 'root' : faker.name.findName(),
        phone: faker.phone.phoneNumberFormat(),
        address: faker.address.streetAddress() + faker.address.city(),
        birthday: faker.date.past(30),
        gender: index < 6 ? 'M' : 'F',
        isAdmin: index === 0 ? 1 : 0
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return queryInterface.bulkDelete('Users', null, option)
  }
};
