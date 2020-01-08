'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('Tag_items',
        Array.from({ length: 90 }, (val, index) => ({
          tag_Id: 1,
          product_id: index + 11
        }))
      ),
      queryInterface.bulkInsert('Tag_items',
        Array.from({ length: 5 }, (val, index) => ({
          tag_Id: 2,
          product_id: index + 1
        }))
      ),
      queryInterface.bulkInsert('Tag_items',
        Array.from({ length: 5 }, (val, index) => ({
          tag_Id: 3,
          product_id: index + 1
        }))
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return Promise.all([
      queryInterface.bulkDelete('Tag_items', null, option)
    ])
  }
};

/**
 * 共 100 筆
 * product_id   tag
 *   1-5         2 (特典)
 *   1-5         3 (販售中)
 *   ~11         1 (預約中)
 */