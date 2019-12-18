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
    releaseDate: {
      type: DataTypes.DATE,
      field: 'release_date'
    },
    saleDate: {
      type: DataTypes.DATE,
      field: 'sale_date'
    },
    deadline: DataTypes.DATE,
    SeriesId: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER,
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }, { timestamps: true });
  Product.associate = function(models) {
    // associations can be defined here
  };
  return Product;
};