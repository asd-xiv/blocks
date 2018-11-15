const BaseError = require("./base.error")

/**
 * @class InputValidationError
 */
module.exports = class InputValidationError extends BaseError {
  constructor(message, details = {}) {
    super(message, details)

    this.name = "InputValidationError"
    this.statusCode = 409
  }
}
