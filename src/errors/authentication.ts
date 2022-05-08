import { BaseError } from "./base"

class AuthenticationError extends BaseError {
  constructor(
    message = "Need to be authenticated to access resource",
    details: Record<string, any>
  ) {
    super(message, details)

    this.name = "AuthenticationError"
    this.statusCode = 401
  }
}

export { AuthenticationError }
