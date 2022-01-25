import { BaseError } from "./base.js"

class InputError extends BaseError {
  constructor(message, details) {
    super(message, details)

    this.name = "InputError"
    this.statusCode = 409
  }
}

export { InputError }
