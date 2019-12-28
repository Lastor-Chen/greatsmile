'use strict';

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Cart_items',
      Array.from({ length: 15}, (val, index) => ({
        quantity: randomNum( 1, 3),
        cart_id: randomNum( 1, 5 ),
        product_id: index + 1
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return queryInterface.bulkDelete('Cart_items', null, option)
  }
};


// 預設 5 位使用者， 5 個購物車，共 15 樣商品
// 商品數量隨機 1-5 個
// 商品避免重複，照順序取 id 1-15 的商品