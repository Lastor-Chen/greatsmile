'use strict';
module.exports = (sequelize, DataTypes) => {
  const Series = sequelize.define('Series', {
    name: DataTypes.STRING
  }, {});
  Series.associate = function(models) {
    Series.hasMany(models.Product)
  };
  return Series;
};