'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('Users',
        Array.from({ length: 3 }, (val, index) => ({
          name: index === 0 ? 'root' : faker.name.findName(),
          email: index === 0 ? 'root@example.com' : `user${index}@example.com`,
          password: bcrypt.hashSync('12345678', 10),
          isAdmin: index === 0 ? 1 : 0
        }))
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }

    return queryInterface.bulkDelete('Users', null, option)

  }
};
