'use strict';

const { Model, DataTypes } = require('sequelize');
const moment = require('moment');

const BadRequestException = require('../exceptions/bad-request.exception');

module.exports = sequelize => {
  class PointRecord extends Model {
    static associate(models) { }
  }
  PointRecord.init({
    employeeId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'employeeId cannot be null'
        },
        notEmpty: {
          msg: 'employeeId cannot be empty'
        }
      }
    },
    employerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'employerId cannot be null'
        },
        notEmpty: {
          msg: 'employerId cannot be empty'
        }
      }
    },
    includedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'includedAt cannot be null'
        },
        notEmpty: {
          msg: 'includedAt cannot be empty'
        },
        isEven(value) {
          if (moment(value).isAfter(moment())) {
            throw new BadRequestException('IncludedAt cannot be greater than the current date');
          }
        }
      }
    },
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PointRecord',
  });
  return PointRecord;
};