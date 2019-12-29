'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Carts',
      Array.from({ length: 5 }, (val, index) => ({   // 預設 5 位使用者， 5 個購物車
        id: index + 1
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return queryInterface.bulkDelete('Carts', null, option)
  }
};
