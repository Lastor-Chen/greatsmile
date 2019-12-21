'use strict';
module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    url: DataTypes.STRING,
    ProductId: DataTypes.INTEGER,
    isMain: DataTypes.BOOLEAN
  }, {});
  Image.associate = function(models) {
    Image.belongsTo(models.Product)
  };
  return Image;
};