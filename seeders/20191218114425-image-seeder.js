'use strict';
const faker = require('faker')

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('Images',
        Array.from({ length: 60 }, (val, index) => ({
          url: `https://picsum.photos/seed/${index + 1}/530/670`,
          product_id: index < 6 ? 1 : randomNum(2, 20),
          is_main: false
        }))
      ),
      queryInterface.bulkInsert('Images',
        Array.from({ length: 20 }, (val, index) => ({
          url: `https://picsum.photos/seed/main${index + 1}/530/670`,
          product_id: index + 1,
          is_main: true
        }))
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return Promise.all([
      queryInterface.bulkDelete('Images', null, option)
    ])
  }
};
