import { BaseError } from "./base.js"

class NotFoundError extends BaseError {
  constructor(message, details) {
    super(message, details)

    this.name = "NotFoundError"
    this.statusCode = 404
  }
}

export { NotFoundError }
