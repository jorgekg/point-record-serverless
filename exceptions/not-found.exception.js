module.exports = class NotFoundException extends Error {

  constructor(message) {
    super(message);
    this.code = 404;
  }

}