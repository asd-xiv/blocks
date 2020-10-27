const debug = require("debug")("blocks:JWTDecodeMiddleware")

const jwt = require("jsonwebtoken")
const { is, isEmpty } = require("@asd14/m")

const { InputError } = require("../errors/input")

module.exports = () =>
  // only active middleware if JWT_SECRET present
  isEmpty(process.env.JWT_SECRET)
    ? null
    : (req, res, next) => {
        // safe destructuring in route methods
        req.ctx.jwt = {}

        if (is(req.headers.authorization)) {
          try {
            req.ctx.jwt = jwt.verify(
              req.headers.authorization,
              process.env.JWT_SECRET
            )
          } catch (error) {
            next(
              new InputError("Invalid JWT", {
                method: req.method,
                path: req.ctx.pathname,
              })
            )
          }
        }

        next()
      }
