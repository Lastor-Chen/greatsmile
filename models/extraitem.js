'use strict';
module.exports = (sequelize, DataTypes) => {
  const ExtraItem = sequelize.define('ExtraItem', {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    ProductId: DataTypes.INTEGER,
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }, {});
  ExtraItem.associate = function(models) {
    // associations can be defined here
  };
  return ExtraItem;
};