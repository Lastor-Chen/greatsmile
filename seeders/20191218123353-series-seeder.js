'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const series = ['鬼滅之刃', '寶可夢', '排球少年', 'Vocaloid']
    return queryInterface.bulkInsert('Series',
      series.map((item, index) => ({
        name: item
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return queryInterface.bulkDelete('Series', null, option)
  }
};
