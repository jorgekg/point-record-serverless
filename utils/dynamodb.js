const aws = require('aws-sdk');

aws.config.update({
  region: process.env.region,
  endpoint: process.env.endpoint,
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey
});

module.exports = class DynamoDB {

  constructor() {
    this.dynamo = new aws.DynamoDB.DocumentClient();
  }

}