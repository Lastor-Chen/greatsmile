'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      sn: {
        type: Sequelize.STRING,
        unique: true
      },
      amount: {
        type: Sequelize.INTEGER
      },
      delivery_id: {
        type: Sequelize.INTEGER
      },
      pay_method: {
        type: Sequelize.STRING
      },
      pay_status: {
        type: Sequelize.BOOLEAN
      },
      ship_status: {
        type: Sequelize.BOOLEAN
      },
      receiver: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Orders');
  }
};