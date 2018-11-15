const BaseError = require("./base.error")

/**
 * @class NotFoundError
 */
module.exports = class NotFoundError extends BaseError {
  constructor(message, details = {}) {
    super(message, details)

    this.name = "NotFoundError"
    this.statusCode = 404
  }
}
