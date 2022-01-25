const { BaseError } = require("./base.js")

class AuthenticationError extends BaseError {
  constructor(
    message = "Need to be authenticated to access resource",
    details
  ) {
    super(message, details)

    this.name = "AuthenticationError"
    this.statusCode = 401
  }
}

module.exports = { AuthenticationError }
