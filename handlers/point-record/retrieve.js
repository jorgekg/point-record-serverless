'use strict';

const Handler = require('../handler');
const PointRecordService = require('../../services/point-record/point-record.service');

module.exports.handler = async (event) => {
  return await new Handler().map(async database => {
    const { id } = event.pathParameters;
    return await new PointRecordService(database).get(id);
  }, event);
};
