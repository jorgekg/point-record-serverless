const Database = require('../utils/database');

module.exports = class Cron {

  constructor() {
    this.database = new Database();
  }

  async map(callback) {
    try {
      await callback(this.database)
    } catch (err) {
      console.log(err);
    }
  }

}