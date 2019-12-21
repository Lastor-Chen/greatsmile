'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const tag = ['預購中', '附特典', '庫存販售商品']
    return queryInterface.bulkInsert('Tags',
      tag.map((item, index) => ({
        name: item,
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return queryInterface.bulkDelete('Tags', null, option)
  }
};
