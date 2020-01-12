'use strict';

const faker = require('faker')

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('orders',
      Array.from({ length: 25 }, (val, index) => ({
        user_id: randomNum(1, 10),
        sn: faker.random.number(),
        amount: randomNum(2000, 30000),
        delivery_id: randomNum(1, 3),
        pay_method: faker.commerce.productMaterial(),
        pay_status: 0,
        ship_status: randomNum(0, 1),
        receiver: faker.name.findName(),
        address: faker.address.zipCode() + ' ' + faker.address.city() + ' ' + faker.address.streetAddress() + faker.address.secondaryAddress(),
        phone: faker.phone.phoneNumberFormat()
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return queryInterface.bulkDelete('orders', null, option)
  }
};
