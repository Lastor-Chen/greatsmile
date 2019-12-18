'use strict';
module.exports = (sequelize, DataTypes) => {
  const Series = sequelize.define('Series', {
    name: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }, {});
  Series.associate = function(models) {
    // associations can be defined here
  };
  return Series;
};