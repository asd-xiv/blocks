import jwt from "jsonwebtoken"

import { AuthenticationError } from "../../src/core.errors/authentication.js"

export default {
  method: "GET",
  path: "/with-jwt",
  authenticate: () => request => {
    try {
      const jwtData = jwt.verify(
        request.headers.authorization,
        process.env.JWT_SECRET
      )

      request.ctx.jwt = jwtData
    } catch (error) {
      throw new AuthenticationError(error.message)
    }
  },
  authorize: () => () => true,
  action:
    () =>
    ({
      ctx: {
        jwt: { jti, foo },
      },
    }) => {
      return {
        jti,
        foo,
      }
    },
}
