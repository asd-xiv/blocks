const { BaseError } = require("./base")

class AuthorizationError extends BaseError {
  constructor(message = "Need permission to access resource", details) {
    super(message, details)

    this.name = "AuthorizationError"
    this.statusCode = 403
  }
}

module.exports = { AuthorizationError }
