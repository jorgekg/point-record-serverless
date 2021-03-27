'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  class PointIntegrationLog extends Model {
    static associate(models) {}
  }
  PointIntegrationLog.init({
    pointId: DataTypes.BIGINT,
    status: DataTypes.STRING,
    log: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PointIntegrationLog',
  });
  return PointIntegrationLog;
};