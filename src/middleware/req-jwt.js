const debug = require("debug")("blocks:JWTDecodeMiddleware")

import jwt from "jsonwebtoken"
import { is, isEmpty } from "@mutant-ws/m"

import { InputValidationError } from "../errors/input"

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
              new InputValidationError("Invalid JWT", {
                method: req.method,
                path: req.ctx.pathname,
              })
            )
          }
        }

        next()
      }
