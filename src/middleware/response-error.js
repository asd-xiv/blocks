import d from "debug"
import { pluck, is } from "@asd14/m"

const debug = d("blocks:ErrorMiddleware")

export default ({ ErrorPlugin }) =>
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
