'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    UserId: DataTypes.INTEGER,
    sn: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    DeliveryId: DataTypes.INTEGER,
    payMethod: DataTypes.STRING,
    payStatus: DataTypes.BOOLEAN,
    orderNo: DataTypes.STRING,
    shipStatus: DataTypes.BOOLEAN,
    receiver: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {});
  Order.associate = function (models) {
    Order.belongsTo(models.Delivery)
    Order.belongsToMany(models.Product, {
      through: models.OrderItem,
      foreignKey: 'order_id',
      as: 'products'
    })
    Order.belongsTo(models.User)
  };
  return Order;
};