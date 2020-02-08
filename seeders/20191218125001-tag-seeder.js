'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const tag = ['Tag']
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
