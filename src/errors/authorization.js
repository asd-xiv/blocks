import { BaseError } from "./base"

export class AuthorizationError extends BaseError {
  constructor(message = "Not allowed to access resource", details = {}) {
    super(message, details)

    this.name = "AuthorizationError"
    this.statusCode = 403
  }
}
