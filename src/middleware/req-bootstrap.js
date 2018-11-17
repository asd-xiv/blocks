const debug = require("debug")("Blocks:BootstrapMiddleware")

const cuid = require("cuid")
const { pick } = require("@asd14/m")

module.exports = () => (req, res, next) => {
  req.ctx = {
    id: cuid(),
    startAt: process.hrtime(),
    ...pick(["query", "pathname"])(req._parsedUrl),
  }
  res.ctx = {}

  next()
}
