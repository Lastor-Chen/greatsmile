'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const methods = [
      ['店鋪取貨', 0], 
      ['便利商店取貨', 80], 
      ['宅配', 150]
    ]

    return queryInterface.bulkInsert('Deliveries',
      methods.map(item => ({
        method: item[0],
        price: item[1]
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return queryInterface.bulkDelete('Deliveries', null, option)
  }
};
