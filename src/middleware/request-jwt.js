const debug = require("debug")("blocks:JWTDecodeMiddleware")

const jwt = require("jsonwebtoken")
const { is, isEmpty } = require("@asd14/m")

const { InputError } = require("../errors/input.js")

module.exports = () =>
  // Active middleware if JWT_SECRET present
  isEmpty(process.env.JWT_SECRET)
    ? undefined
    : (request, response, next) => {
        // Safe destructuring in route methods
        request.ctx.jwt = {}

        if (is(request.headers.authorization)) {
          try {
            request.ctx.jwt = jwt.verify(
              request.headers.authorization,
              process.env.JWT_SECRET
            )
          } catch {
            next(
              new InputError("Invalid JWT", {
                method: request.method,
                path: request.ctx.pathname,
              })
            )
          }
        }

        next()
      }
