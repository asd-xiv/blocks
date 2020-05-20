const debug = require("debug")("blocks:ErrorMiddleware")

module.exports = () => (error, req, res, next) => {
  debug(error)

  res.ctx.status = error.statusCode || 500
  res.ctx.payload = {
    error: error.name,
    message: error.message,
    details: error.details,
  }

  next(error)
}
