const parseOData = require('odata-sequelize');

const NotFoundException = require('../exceptions/not-found.exception');

module.exports = class Service {

  constructor(database, Model) {
    this.sequelize = database.sequelize;
    this.database = database;
    this.model = Model(this.sequelize, database.schema);
  }

  async get(id) {
    let entity = await this.model.findByPk(id);
    if (!entity) {
      throw new NotFoundException(`Id ${id} not found!`);
    }
    return entity;
  }

  async list(filter) {
    if (!filter) {
      filter = {};
    }
    if (!filter.size) {
      filter.top = 10;
    } else {
      filter.top = parseInt(filter.size);
      delete filter.size;
    }
    if (!filter.page) {
      filter.skip = 0;
    } else {
      filter.skip = ((filter.page - 1) * filter.top);
      delete filter.page;
    }
    const filterStr = Object.keys(filter).map(key => '$' + key + '=' + filter[key]).join('&');
    const query = parseOData(filterStr, this.sequelize);
    const data = await this.model.findAndCountAll(query);
    return {
      totalElements: data.count,
      totalPages: parseInt(data.count / filter.top) + 1,
      contents: data.rows
    };
  }

  async create(entity) {
    let entitySaved = null;
    if (this.beforeCreate) {
      await this.beforeCreate(entity);
    }
    entitySaved = await this.model.create(entity);
    if (this.afterCreate) {
      await this.afterCreate(entitySaved);
    }
    return entitySaved;
  }
}