const Service = require("../service");

const HistoryIntegration = require('../../models/historyintegration');

module.exports = class HistoryIntegrationService extends Service {

  constructor(database) {
    super(database, HistoryIntegration);
  }

}