'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: DataTypes.STRING,
    ProductId: DataTypes.INTEGER
  }, {});
  Tag.associate = function(models) {
    Tag.belongsTo(models.Product)
  };
  return Tag;
};