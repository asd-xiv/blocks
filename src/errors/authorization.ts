import { BaseError } from "./base"

class AuthorizationError extends BaseError {
  constructor(
    message = "Need permission to access resource",
    details: Record<string, any>
  ) {
    super(message, details)

    this.name = "AuthorizationError"
    this.statusCode = 403
  }
}

export { AuthorizationError }
