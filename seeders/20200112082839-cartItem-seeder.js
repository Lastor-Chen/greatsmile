'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // 清空用，do nothing
    return queryInterface.showAllSchemas()
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return queryInterface.bulkDelete('cart_items', null, option)
  }
};
