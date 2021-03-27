'use strict';

const Cron = require("./cron");

const PointRecordService = require("../services/point-record/point-record.service");

module.exports.cron = async () => {
  // O número 4096 é com base no máximo de dados transferidos do DynamoDB.
  // O valor total é 1MB, segundo a documentação oficial da AWS, sedo que a média do json recebido é 250 bytes.
  // Com este padrão é possível buscar 4,096 linhas por KB transferidos.
  // Multiplicando por 1000 para ter o número em MB, acarreta no 4096.
  const maxLimitForQuery = 4096;
  await new Cron().map(async database => {
    const pointService = new PointRecordService(database);
    let pointDynamoDB = await pointService.getOfDynamoDB(maxLimitForQuery);
    for (let i = 0; i < pointDynamoDB.Items.length; i++) {
      const point = pointDynamoDB.Items[i];
      console.log(`Integrating the points of the DynamoDB (${point.id})`);
      let entity = await pointService.get(point.id, false);
      if (!entity) {
        entity = await pointService.create(point);
      }
      await pointService.deleteOfDynamoDB(entity.id);
    }
  });
};
