'use strict';
const faker = require('faker')

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Images',
      Array.from({ length: 60 }, (val, index) => ({
        url: faker.image.imageUrl(530, 670),
        product_id: index < 7 ? 1 : randomNum(1, 20)
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return queryInterface.bulkDelete('Images', null, option)
  }
};
