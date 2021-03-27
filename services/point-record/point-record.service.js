const Service = require('../service');

const PointRecord = require('../../models/point-record');
const StatusIntegration = require('../../enums/status-integration');

module.exports = class PointRecordService extends Service {

  constructor(database) {
    super(database, PointRecord);
  }

  async beforeCreate(entity) {
    entity.status = StatusIntegration.AWAITING;
  }
}