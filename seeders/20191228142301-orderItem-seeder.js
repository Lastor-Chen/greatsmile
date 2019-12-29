'use strict';

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('OrderItems',
      Array.from({ length: 50 }, (val, index) => ({
        price: randomNum(1000, 10000),
        quantity: randomNum(1, 3),
        order_id: index < 25 ? index + 1 : index - 24,
        product_id: randomNum(1, 100)
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return queryInterface.bulkDelete('OrderItems', null, option)
  }
};
