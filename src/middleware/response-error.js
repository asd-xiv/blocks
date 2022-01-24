const debug = require("debug")("blocks:ErrorMiddleware")

const { pluck, is } = require("@asd14/m")

module.exports =
  ({ ErrorPlugin }) =>
  (error, request, response, next) => {
    response.ctx.status = error.statusCode || 500
    response.ctx.payload = {
      error: error.name,
      message: error.message,
      details: error.details,
    }

    if (is(ErrorPlugin)) {
      ErrorPlugin.error(error, {
        request: {
          ...pluck(["method", "path"], request.ctx.route),
          ...pluck(["body", "query", "params", "jwt"], request.ctx),
          headers: request.headers,
        },
        response: response.ctx,
      })
    }

    debug(error)

    next(error)
  }
