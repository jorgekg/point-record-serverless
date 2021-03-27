const aws = require('aws-sdk');

aws.config.update({
  region: process.env.DYNAMO_DB.region,
  endpoint: process.env.DYNAMO_DB.endpoint,
  accessKeyId: process.env.DYNAMO_DB.accessKeyId,
  secretAccessKey: process.env.DYNAMO_DB.secretAccessKey
});

module.exports = class DynamoDB {

  constructor() {
    this.dynamo = new aws.DynamoDB.DocumentClient();
  }

}