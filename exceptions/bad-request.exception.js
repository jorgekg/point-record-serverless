module.exports = class BadRequestException extends Error {

  constructor(message) {
    super(message);
    this.code = 400;
  }

}