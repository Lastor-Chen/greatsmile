'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const tag = ['預約中', '附特典', '庫存發售中']
    return queryInterface.bulkInsert('tags',
      tag.map((item, index) => ({
        name: item,
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return queryInterface.bulkDelete('tags', null, option)
  }
};
