const Database = require('../utils/database');
const BadRequestException = require('../exceptions/bad-request.exception');

module.exports = class Handler {

  async map(callback, event) {
    try {
      const database = new Database();
      if (!event.body) {
        throw new BadRequestException('Body is required');
      }
      return {
        statusCode: 200,
        body: JSON.stringify(await callback(database, JSON.parse(event.body))),
      };
    } catch (err) {
      console.log(err);
      if (err.error && err.error.errors) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            code: 400,
            message: err.error.errors.map(errMap => errMap.message).join(', ')
          }),
        };
      }
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