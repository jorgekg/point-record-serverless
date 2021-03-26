const Service = require('../service');

const PointIntegrationLog = require('../../models/point-integration-log');

module.exports = class PointIntegrationLogService extends Service {

  constructor(database) {
    super(database, PointIntegrationLog);
  }

}