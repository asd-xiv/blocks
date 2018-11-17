const debug = require("debug")("Blocks:QueryMiddleware")
const qs = require("qs")

module.exports = () => (req, res, next) => {
  req.ctx.query = qs.parse(req.ctx.query, {
    delimiter: "&",
    allowDots: true,
    strictNullHandling: true,
    arrayFormat: "brackets",
  })

  next()
}
