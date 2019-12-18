'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    const categories = ['Figure', '豆丁人', 'Figma', '組裝模型(仮)']
    return queryInterface.bulkInsert('Categories',
      categories.map((item, index) => ({
        name: item
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return queryInterface.bulkDelete('Categories', null, option)
  }
};
