'use strict';
const faker = require('faker')
const images = require('./image.json')

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('images', images)

    // return Promise.all([
    //   queryInterface.bulkInsert('images',
    //     Array.from({ length: 260 }, (val, index) => ({
    //       url: `https://picsum.photos/seed/${index + 1}/530/670`,
    //       product_id: index < 6 ? 1 : randomNum(2, 100),
    //       is_main: false
    //     }))
    //   ),
    //   queryInterface.bulkInsert('images',
    //     Array.from({ length: 100 }, (val, index) => ({
    //       url: `https://picsum.photos/seed/main${index + 1}/530/670`,
    //       product_id: index + 1,
    //       is_main: true
    //     }))
    //   ),
    // ])
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return Promise.all([
      queryInterface.bulkDelete('images', null, option)
    ])
  }
};

// id 1 商品必有7張圖
// 各商品只有一張 main image，假圖 API 網址包含 "main" 字樣