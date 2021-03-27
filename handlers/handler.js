const Database = require('../utils/database');

module.exports = class Handler {

  async map(callback, event) {
    const database = new Database();
    try {
      const response = {
        statusCode: 200,
        body: JSON.stringify(await callback(database, event.body ? JSON.parse(event.body) : null)),
      };
      database.close();
      return response;
    } catch (err) {
      database.close();
      if (err.name === 'SequelizeValidationError' && err.errors) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            code: 400,
            message: err.errors.map(errMap => errMap.message).join(', ')
          }),
        };
      }
      console.log(err);
      return {
        statusCode: err.code || 500,
        body: JSON.stringify({
          code: err.code || 500,
          message: err.message
        }),
      };
    }
  }

}