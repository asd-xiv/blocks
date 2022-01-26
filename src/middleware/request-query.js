const debug = require("debug")("blocks:QueryMiddleware")

const { isEmpty } = require("@asd14/m")

module.exports =
  ({ QueryParser }) =>
  (request, response, next) => {
    request.ctx.query = isEmpty(request.ctx.query)
      ? {}
      : QueryParser.parse(request.ctx.query)

    next()
  }
