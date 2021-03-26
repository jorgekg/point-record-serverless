'use strict';

const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class PointRecord extends Model {
    static associate(models) {}
  }
  PointRecord.init({
    employeeId: DataTypes.BIGINT,
    employerId: DataTypes.BIGINT,
    includedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PointRecord',
  });
  return PointRecord;
};