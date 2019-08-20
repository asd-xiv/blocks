const debug = require("debug")("blocks:JWTDecodeMiddleware")

import jwt from "jsonwebtoken"
import { replace, is } from "@asd14/m"

import { InputValidationError } from "../errors/input"

module.exports = ({ Config: { JWT_SECRET } }) => (req, res, next) => {
  if (is(req.headers.authorization)) {
    try {
      req.ctx.jwt = jwt.verify(
        replace("JWT ", "")(req.headers.authorization),
        JWT_SECRET
      )
    } catch (error) {
      next(new InputValidationError("Invalid JWT"))
    }
  }

  next()
}
