'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
  }, {});
  Cart.associate = function(models) {
    Cart.hasMany(models.CartItem, { onDelete: 'cascade', hooks: true })
    Cart.belongsToMany(models.Product, {
      through: models.CartItem,
      foreignKey: 'cart_id',
      as: 'products'
    })
  };
  return Cart;
};
