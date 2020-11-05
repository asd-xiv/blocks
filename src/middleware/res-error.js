const debug = require("debug")("blocks:ErrorMiddleware")

const { is } = require("@asd14/m")

module.exports = ({ ErrorPlugin }) => (error, req, res, next) => {
  if (is(ErrorPlugin)) {
    ErrorPlugin.error(error)
  }

  debug(error)

  res.ctx.status = error.statusCode || 500
  res.ctx.payload = {
    error: error.name,
    message: error.message,
    details: error.details,
  }

  next(error)
}
