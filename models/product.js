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
  Product.associate = function (models) {
    Product.hasMany(models.Image)
    Product.hasMany(models.Gift)
    Product.hasMany(models.CartItem)
    Product.belongsTo(models.Series)
    Product.belongsTo(models.Category)
    Product.belongsToMany(models.Tag, {
      through: models.TagItem,
      foreignKey: 'product_id',
      as: 'tags'
    })
    Product.belongsToMany(models.Cart, {
      through: models.CartItem,
      foreignKey: 'product_id',
      as: 'carts'
    })
    Product.belongsToMany(models.Order, {
      through: models.OrderItem,
      foreignKey: 'product_id',
      as: 'products'
    })
  };
  return Product;
};