const { Sequelize } = require('sequelize');
const pg = require('pg');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

module.exports = class Database {

  constructor() {
    this.sequelize = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      dialect: config.dialect,
      dialectModule: pg,
      database: config.database,
      logging: false,
      pool: {
        max: 1
      }
    });
  }

  async close() {
    await this.sequelize.close();
  }
}