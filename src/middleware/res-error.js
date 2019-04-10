const debug = require("debug")("Blocks:ErrorMiddleware")

module.exports = () => (error, req, res, next) => {
  debug(error)

  res.ctx.status = error.statusCode || 500
  res.ctx.payload = {
    error: error.name,
    code: res.ctx.status,
    message: error.message,
    details: error.details || {},
  }

  next(error)
}
