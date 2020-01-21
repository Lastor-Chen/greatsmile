'use strict';

const tagItems = require('./json/tagItems.json')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('tag_items',
        Array.from({ length: 50 }, (val, index) => ({
          tag_Id: 1,  // 預約中
          product_id: index + 51
        }))
      ),
      queryInterface.bulkInsert('tag_items',
        Array.from({ length: 30 }, (val, index) => ({
          tag_Id: 2,  // 附特典
          product_id: (index + 1) * 3
        }))
      ),
      queryInterface.bulkInsert('tag_items',
        Array.from({ length: 50 }, (val, index) => ({
          tag_Id: 3,  // 發售中
          product_id: index + 1
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

/**
 * 共 100 筆
 * product_id   tag
 *   51-100     1 (預約中)
 *   3n         2 (附特典)
 *   1-50       3 (發售中)
 */