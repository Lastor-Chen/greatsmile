'use strict';
module.exports = (sequelize, DataTypes) => {
  const ExtraItem = sequelize.define('ExtraItem', {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    ProductId: DataTypes.INTEGER
  }, {});
  ExtraItem.associate = function(models) {
    // associations can be defined here
  };
  return ExtraItem;
};