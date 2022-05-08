import { BaseError } from "./base"

class InputError extends BaseError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, details)

    this.name = "InputError"
    this.statusCode = 409
  }
}

export { InputError }
