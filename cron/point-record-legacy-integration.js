'use strict';

const Cron = require("./cron");
const Request = require("../utils/request");
const IntegrationSituation = require('../enums/integration-situation');

const PointRecordService = require("../services/point-record/point-record.service");
const StatusIntegration = require("../enums/status-integration");
const HistoryIntegrationService = require("../services/history-integration/history-integration.service");

module.exports.cron = async () => {
  await integrationFunction(StatusIntegration.AWAITING);
  await integrationFunction(StatusIntegration.ERROR);
};

const integrationFunction = async (status) => {
  // Valor padrão para conexões com o sistema legado.
  let maxOpenRequests = 5;
  // Valor padrão para máximo de requests por minuto.
  let maxLimitForQuery = 300;
  // Contém o valor total de requisições aguardando resposta
  let openRequests = 0;
  // Contem o valor de erros nas requests, que será utilizado para reduzir o número de thread em aberto
  let errorRequests = 0;

  await new Cron().map(async database => {
    const historyIntegrationService = new HistoryIntegrationService(database);
    const histories = await historyIntegrationService.list();
    console.log('Integrando: ' + histories.contents.length);
    if (histories && histories.contents && histories.contents.length) {
      const [history] = histories.contents;
      maxOpenRequests = history.maxOpenRequest || 5;
      maxLimitForQuery = history.maxLimitForQuery || 300;
    }
    const pointService = new PointRecordService(database);
    const points = await pointService.list({
      filter: `status eq '${status}'`,
      size: maxLimitForQuery
    });
    for (let i = 0; i < points.contents.length; i++) {
      const point = points.contents[i].dataValues;
      if (point) {
        await pointService.updateStatus(point.id, StatusIntegration.INTEGRATING, point);
      }
    }
    for (let i = 0; i < points.contents.length; i++) {
      const point = points.contents[i].dataValues;
      if (point) {
        openRequests++;
        new Request().sendLegacyPoint(point)
          .then(async integration => {
            if (integration && integration.message === IntegrationSituation.SUCCESS) {
              await pointService.updateStatus(point.id, StatusIntegration.INTEGRATED, point);
            } else {
              errorRequests++;
              await pointService.updateStatus(point.id, StatusIntegration.ERROR, point, integration);
            }
          })
          .catch(async err => {
            errorRequests++;
            await pointService.updateStatus(point.id, StatusIntegration.ERROR, point, err);
          })
          .finally(() => openRequests--);
      }
      if (openRequests >= Math.floor(maxOpenRequests)) {
        if (errorRequests > 0) {
          maxOpenRequests = maxOpenRequests - (maxOpenRequests * (10 / 100));
        } else {
          maxOpenRequests = maxOpenRequests + (maxOpenRequests * (1.5 / 100));
        }
        errorRequests = 0;
        // Quando se atinge o limite, aguarda um tempo para respostas das threads.
        await (new Promise(resolve => {
          setTimeout(() => resolve(), 250);
        }));
      }
      console.warn(`Open requests: ${openRequests}`, `Max open requests: ${maxOpenRequests}`, `Errors: ${errorRequests}`);
    }
    if (histories && histories.contents && histories.contents.length) {
      const [history] = histories.contents;
      history.maxOpenRequest = Math.floor(maxOpenRequests);
      history.maxLimitForQuery = Math.floor(maxOpenRequests * 60);
      await historyIntegrationService.update(history.id, history);
    } else {
      await historyIntegrationService.create({
        maxOpenRequest: Math.floor(maxOpenRequests),
        maxLimitForQuery: Math.floor(maxOpenRequests * 60)
      });
    }
  });
}
