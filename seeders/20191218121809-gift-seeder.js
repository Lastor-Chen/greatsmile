'use strict';
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('gifts',
      Array.from({ length: 5 }, (val, index) => ({
        name: faker.commerce.productName(),
        image: `https://picsum.photos/seed/gift${index + 1}/360/400`,
        product_id: index + 1
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return queryInterface.bulkDelete('gifts', null, option)
  }
};

// 只有前 5 項商品有特典