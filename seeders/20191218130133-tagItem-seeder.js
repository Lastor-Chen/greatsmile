'use strict';

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('tag_items',
        Array.from({ length: 50 }, (val, index) => ({
          tag_Id: 1,  // 預約中
          product_id: index + 50
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
      )
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
 *   random     2 (附特典)
 *   1-50       3 (發售中)
 */