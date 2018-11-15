/**
 * @class BaseError
 */
module.exports = class BaseError extends Error {
  constructor(message, details = {}) {
    super(message)

    this.name = "BaseError"
    this.statusCode = 400
    this.details = details
  }
}
