'use strict';
module.exports = (sequelize, DataTypes) => {
  const Series = sequelize.define('Series', {
    name: DataTypes.STRING
  }, {});
  Series.associate = function(models) {
    // associations can be defined here
  };
  return Series;
};