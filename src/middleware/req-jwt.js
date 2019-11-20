const debug = require("debug")("blocks:JWTDecodeMiddleware")

import jwt from "jsonwebtoken"
import { replace, is, isEmpty } from "@mutantlove/m"

import { InputValidationError } from "../errors/input"

module.exports = () =>
  isEmpty(process.env.JWT_SECRET)
    ? null
    : (req, res, next) => {
        if (is(req.headers.authorization)) {
          try {
            req.ctx.jwt = jwt.verify(
              replace("JWT ", "")(req.headers.authorization),
              process.env.JWT_SECRET
            )
          } catch (error) {
            next(new InputValidationError("Invalid JWT"))
          }
        }

        next()
      }
