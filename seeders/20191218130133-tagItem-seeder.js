'use strict';

const tagItems = require('./json/tagItems.json')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('tag_items',
        Array.from({ length: 30 }, (val, index) => ({
          tag_Id: 1,  // 附特典
          product_id: (index + 1) * 3  // 每 3 筆賦予特典
        }))
      ),
      queryInterface.bulkInsert('tag_items', tagItems)
    ])
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return Promise.all([
      queryInterface.bulkDelete('tag_items', null, option)
    ])
  }
};
