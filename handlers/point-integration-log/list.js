'use strict';

const Handler = require('../handler');
const PointIntegrationLogService = require('../../services/point-integration-log/point-integration-log.service');

module.exports.handler = async (event) => {
  return await new Handler().map(async database => {
    return await new PointIntegrationLogService(database).list(event.queryStringParameters);
  }, event);
};
