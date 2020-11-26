const debug = require("debug")("blocks:QueryMiddleware")

const { isEmpty } = require("@asd14/m")

module.exports = ({ QueryParser }) => (req, res, next) => {
  req.ctx.query = isEmpty(req.ctx.query) ? {} : QueryParser.parse(req.ctx.query)

  next()
}
