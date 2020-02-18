import { BaseError } from "./base"

export class NotFoundError extends BaseError {
  constructor(message, details) {
    super(message, details)

    this.name = "NotFoundError"
    this.statusCode = 404
  }
}
