'use strict';
const faker = require('faker')

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = {
  up: (queryInterface, Sequelize) => {
     return queryInterface.bulkInsert('Products',
       Array.from({ length: 20 }, (val, index) => ({
         name: faker.commerce.productName(),
         price: faker.commerce.price(1000,8000),
         inventory: index === 1 ? 0 : randomNum(30, 50),
         slogan: faker.lorem.words(),
         description: faker.lorem.lines(2),
         spec: faker.lorem.sentence(),
         copyright: faker.company.companyName(),
         maker: faker.company.companyName(),
         status: index > 4 && index < 10 ? 0 : 1,
         release_date: faker.date.between('2019-10-01', '2019-10-31'), 
         sale_date: index < 5 ? faker.date.between('2019-12-01', '2019-12-18') : faker.date.between('2020-02-01', '2020-02-31'),
         deadline: index < 10 ? faker.date.between('2019-11-01', '2019-11-31') : faker.date.between('2020-01-01', '2020-01-31'),
         series_id: randomNum(1, 4),
         category_id: randomNum(1, 4)
       }))
     )
  }, 
    
  down:  (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return queryInterface.bulkDelete('Products', null, option)
  }
};


  // release_date: 1-20 項商品在10月份公開
  // deadline:     1-10 在11月截止預約, 11-20 可預約至明年 1 月(預約中)
  // sale_date:    1-5  在12月開始販售, 6-20 將在明年 2 月份販售,
  //               6-10 等待販售(下架狀態)
