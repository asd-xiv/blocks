const debug = require("debug")("blocks:BootstrapMiddleware")

const cuid = require("cuid")
const contentType = require("content-type")
const { pick } = require("@mutant-ws/m")

module.exports = () => (req, res, next) => {
  req.ctx = {
    id: cuid(),
    startAt: process.hrtime(),
    body: {},
    ...pick(["query", "pathname"])(req._parsedUrl),
  }

  try {
    req.headers["x-content-type"] = contentType.parse(
      req.headers["content-type"]
    ).type
  } catch (error) {
    // do nothing, let JSON schemas do the validation
    req.headers["x-content-type"] = req.headers["content-type"]
  }

  res.ctx = {}

  next()
}
