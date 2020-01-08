'use strict';
module.exports = (sequelize, DataTypes) => {
  const Delivery = sequelize.define('Delivery', {
    method: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {});
  Delivery.associate = function(models) {
    Delivery.hasMany(models.Order)
  };
  return Delivery;
};