'use strict';
module.exports = (sequelize, DataTypes) => {
  const Gift = sequelize.define('Gift', {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    ProductId: DataTypes.INTEGER
  }, {});
  Gift.associate = function(models) {
    Gift.belongsTo(models.Product)
  };
  return Gift;
};