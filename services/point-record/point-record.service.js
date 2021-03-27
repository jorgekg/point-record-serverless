const Service = require('../service');

const PointRecord = require('../../models/point-record');
const StatusIntegration = require('../../enums/status-integration');
const PointIntegrationLogService = require('../point-integration-log/point-integration-log.service');

module.exports = class PointRecordService extends Service {

  constructor(database) {
    super(database, PointRecord);
  }

  async beforeCreate(entity) {
    entity.status = StatusIntegration.AWAITING;
  }

  async afterCreate(entity) {
    const pointIntegrationLogService = new PointIntegrationLogService(this.database);
    await pointIntegrationLogService.create({
      pointId: entity.id,
      status: StatusIntegration.AWAITING,
      log: 'Awaiting integration...'
    });
  }

}