'use strict';
module.exports = (sequelize, DataTypes) => {
  const TagItem = sequelize.define('TagItem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    TagId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER
  }, {});
  TagItem.associate = function(models) {
    // associations can be defined here
  };
  return TagItem;
};