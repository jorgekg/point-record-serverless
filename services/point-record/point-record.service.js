const Service = require('../service');

const PointRecord = require('../../models/point-record');

module.exports = class PointRecordService extends Service {

  constructor(database) {
    super(database, PointRecord);
  }

}