import { BaseError } from "./base"

export class AuthorizationError extends BaseError {
  constructor(message, details = {}) {
    super(message, details)

    this.name = "AuthorizationError"
    this.statusCode = 403
  }
}
