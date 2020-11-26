const debug = require("debug")("blocks:ErrorMiddleware")

const { pick, is } = require("@asd14/m")

module.exports = ({ ErrorPlugin }) => (error, req, res, next) => {
  res.ctx.status = error.statusCode || 500
  res.ctx.payload = {
    error: error.name,
    message: error.message,
    details: error.details,
  }

  if (is(ErrorPlugin)) {
    ErrorPlugin.error(error, {
      request: {
        ...pick(["method", "path"], req.ctx.route),
        ...pick(["body", "query", "params", "jwt"], req.ctx),
        headers: req.headers,
      },
      response: res.ctx,
    })
  }

  debug(error)

  next(error)
}
