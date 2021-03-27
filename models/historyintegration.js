'use strict';
const { Model, DataTypes} = require('sequelize');
module.exports = sequelize => {
  class HistoryIntegration extends Model {
    static associate(models) {}
  }
  HistoryIntegration.init({
    maxOpenRequest: DataTypes.INTEGER,
    maxLimitForQuery: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'HistoryIntegration',
  });
  return HistoryIntegration;
};