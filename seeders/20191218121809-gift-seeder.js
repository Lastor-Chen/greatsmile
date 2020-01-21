'use strict';
const faker = require('faker')

const gifts = require('./json/gifts.json')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('gifts',
      Array.from({ length: 30 }, (val, index) => ({
        name: faker.commerce.productName(),
        image: `https://picsum.photos/seed/gift${index + 1}/360/400`,
        product_id: (index + 1) * 3
      })),
      queryInterface.bulkInsert('gifts', gifts)
    )
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return queryInterface.bulkDelete('gifts', null, option)
  }
};

// 30 份特典，依商品 id 每隔 3 號賦予