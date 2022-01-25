const { BaseError } = require("./base.js")

class NotFoundError extends BaseError {
  constructor(message, details) {
    super(message, details)

    this.name = "NotFoundError"
    this.statusCode = 404
  }
}

module.exports = { NotFoundError }
