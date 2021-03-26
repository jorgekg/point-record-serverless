const { Sequelize } = require('sequelize');
const pg = require('pg');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

module.exports = class Database {

  constructor(schemaStr) {
    this.schema = schemaStr;
    this.sequelize = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      dialect: config.dialect,
      dialectModule: pg,
      database: config.database
    });
  }

  async auth() {
    await this.sequelize.authenticate();
  }

  async close() {
    await this.sequelize.close();
  }
}