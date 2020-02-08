'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('tag_items',
        Array.from({ length: 3 }, (val, index) => ({
          tag_Id: 1,
          product_id: (index + 30)
        }))
      ),
    ])
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return Promise.all([
      queryInterface.bulkDelete('tag_items', null, option)
    ])
  }
};
