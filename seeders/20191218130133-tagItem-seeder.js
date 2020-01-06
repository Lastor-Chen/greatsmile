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
      )   // 需手動把商品 product_id: 2, tag_Id: 3的 tagItem 刪除 (因庫存為 0)
    ])    
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return Promise.all([
      queryInterface.bulkDelete('Tag_items', null, option)
    ])
  }
};
