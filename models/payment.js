'use strict';
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    OrderId: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    code: DataTypes.STRING,
    msg: DataTypes.STRING,
    tradeNo: DataTypes.STRING,
    orderNo: DataTypes.STRING,
    payTime: DataTypes.DATE
  }, {});
  Payment.associate = function(models) {
    Payment.belongsTo(models.Order)
  };
  return Payment;
};