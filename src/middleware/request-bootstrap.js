const debug = require("debug")("blocks:BootstrapMiddleware")

const cuid = require("cuid")
const contentType = require("content-type")
const { pluck } = require("@asd14/m")

module.exports = () => (request, response, next) => {
  request.ctx = {
    id: cuid(),
    startAt: process.hrtime(),
    body: {},
    ...pluck(["query", "pathname"], request._parsedUrl),
  }

  try {
    request.headers["x-content-type"] = contentType.parse(
      request.headers["content-type"]
    ).type
  } catch {
    // Do nothing, let JSON schemas handle the validation
    request.headers["x-content-type"] = request.headers["content-type"]
  }

  response.ctx = {}

  next()
}
