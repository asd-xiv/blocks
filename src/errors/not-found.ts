import { BaseError } from "./base"

class NotFoundError extends BaseError {
  constructor(message: string, details: Record<string, any>) {
    super(message, details)

    this.name = "NotFoundError"
    this.statusCode = 404
  }
}

export { NotFoundError }
