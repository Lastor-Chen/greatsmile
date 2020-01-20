'use strict';
const faker = require('faker')

const products = require('./json/product.json')

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getInventory(index) {
  if (index === 1) return 0
  if (index === 2) return 2
  return randomNum(50, 150)
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 假資料商品
    await queryInterface.bulkInsert('products',
      Array.from({ length: 100 }, (val, index) => ({
        name: faker.commerce.productName(),
        price: faker.commerce.price(1000, 8000),
        inventory: index < 50 ? getInventory(index) : -1,
        slogan: faker.lorem.words(),
        description: faker.lorem.lines(2),
        spec: faker.lorem.sentence(),
        copyright: faker.company.companyName(),
        maker: faker.company.companyName(),
        status: 1,
        release_date: index < 50 ? faker.date.between('2019-10-01', '2019-10-31') : faker.date.between('2019-12-01', '2019-12-31'),
        deadline: index < 50 ? faker.date.between('2019-11-01', '2019-11-31') : faker.date.between('2020-02-01', '2020-02-29'),
        sale_date: index < 50 ? faker.date.between('2019-12-01', '2019-12-18') : faker.date.between('2020-05-01', '2020-10-31'),
        series_id: randomNum(1, 4),
        category_id: randomNum(1, 4)
      }))
    )

    // 真圖商品
    return queryInterface.bulkInsert('products', products)
  }, 
    
  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return queryInterface.bulkDelete('products', null, option)
  }
};

/**
 * inventory
 *   id=2, 無庫存
 *   id=3, 庫存2
 * 
 * status
 *   6-10 等待販售(下架狀態)
 * 
 * release_date
 *   1-100 項商品在10月份公開
 * 
 * deadline
 *   1-10 在11月截止預約
 *   11-100 可預約至 2020年1月12日 - 2月底(預約中)
 * 
 * sale_date:
 *   1-5 在12月開始販售
 *   6-100 將在明年 3 月份販售
 */

/**
 * 2 無庫存
 * 3 庫存2
 * 1-50 發售中
 * 51-100 預約中
 */