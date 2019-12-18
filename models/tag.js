'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: DataTypes.STRING
  }, {});
  Tag.associate = function(models) {
    Tag.belongsToMany(models.Product, {
      through: models.TagItem,
      foreignKey: 'tag_id',
      as: 'products'
    })
  };
  return Tag;
};