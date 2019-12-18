'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    inventory: DataTypes.INTEGER,
    slogan: DataTypes.STRING,
    description: DataTypes.TEXT,
    spec: DataTypes.STRING,
    copyright: DataTypes.STRING,
    maker: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    releaseDate: DataTypes.DATE,
    saleDate: DataTypes.DATE,
    deadline: DataTypes.DATE,
    SeriesId: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
  };
  return Product;
};