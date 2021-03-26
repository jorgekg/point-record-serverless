'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
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