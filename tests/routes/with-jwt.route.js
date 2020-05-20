const jwt = require("jsonwebtoken")

const { AuthenticationError } = require("../../src/errors/authentication")

module.exports = {
  method: "GET",
  path: "/with-jwt",

  // 409 if invalid req.query, req.headers, req.params or req.body
  // schema: require("./schema"),

  // 401 if returns false or throws
  authenticate: (/* plugins */) => req => {
    try {
      const jwtData = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      )

      req.ctx.jwt = jwtData
    } catch (error) {
      throw new AuthenticationError({ message: error.message })
    }
  },

  // 403 if returns false or throws
  authorize: (/* plugins */) => (/* req */) => true,

  action: (/* plugins */) => ({
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
