import jwt from "jsonwebtoken"
import { is, isEmpty } from "@asd14/m"

import { InputError } from "../errors/input.js"

export default () =>
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
