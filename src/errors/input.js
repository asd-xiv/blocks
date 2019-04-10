import { BaseError } from "./base"

export class InputValidationError extends BaseError {
  constructor(message, details = {}) {
    super(message, details)

    this.name = "InputValidationError"
    this.statusCode = 409
  }
}
