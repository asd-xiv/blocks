class BaseError extends Error {
  statusCode = 400

  details?: Record<string, any>

  constructor(message: string, details?: Record<string, any>) {
    super(message)

    this.name = "BaseError"
    this.details = details
  }
}

export { BaseError }
