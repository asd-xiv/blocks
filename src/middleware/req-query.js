const debug = require("debug")("blocks:QueryMiddleware")

module.exports = ({ QueryParser }) => (req, res, next) => {
  req.ctx.query = QueryParser.parse(req.ctx.query)

  next()
}
