const moment = require('moment');
const uuid = require('uuid');

const Service = require('../service');
const DynamoDB = require('../../utils/dynamodb');

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

  async updateStatus(id, status, entity, error = null) {
    entity.status = status;
    await this.update(id, entity);
    const pointIntegrationLogService = new PointIntegrationLogService(this.database);
    const integration = {
      pointId: entity.id,
      status: StatusIntegration.INTEGRATED,
      log: 'Integration completed...'
    };
    if (entity.status === StatusIntegration.ERROR) {
      integration.status = StatusIntegration.ERROR;
      integration.log = error.message;
    }
    await pointIntegrationLogService.create(integration);
  }

  async createOfDynamoDB(pointRecord) {
    this.validate(pointRecord);
    this.beforeCreate(pointRecord);
    pointRecord.id = uuid.v4();
    return new Promise((resolve, reject) => {
      const db = new DynamoDB();
      db.dynamo.put({
        TableName: 'point',
        Item: pointRecord
      }, err => {
        if (err) reject(err);
        else resolve(pointRecord);
      });
    });
  }

  async getOfDynamoDB(limit) {
    return new Promise((resolve, reject) => {
      const db = new DynamoDB();
      db.dynamo.scan({
        TableName: 'point',
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':status': 'AWAITING'
        },
        Limit: limit
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  async deleteOfDynamoDB(id) {
    return new Promise((resolve, reject) => {
      const db = new DynamoDB();
      db.dynamo.delete({
        TableName: 'point',
        Key: {
          id: id
        }
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  validate(pointRecord) {
    if (!pointRecord.employeeId) {
      throw new BadRequestException('employeeId is required!');
    }

    if (!pointRecord.employerId) {
      throw new BadRequestException('employerId is required!');
    }

    if (!pointRecord.includedAt) {
      throw new BadRequestException('includedAt is required!');
    } else {
      if (moment(pointRecord.includedAt).isAfter(moment())) {
        throw new BadRequestException('IncludedAt cannot be greater than the current date');
      }
    }
  }
}