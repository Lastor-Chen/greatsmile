'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const series = ['鬼滅之刃', '中華一番', 'MARVEL', 'Fate/Grand Order ','新幹線變形機器人 Shinkalion']
    return queryInterface.bulkInsert('series',
      series.map((item, index) => ({
        name: item
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return queryInterface.bulkDelete('series', null, option)
  }
};
